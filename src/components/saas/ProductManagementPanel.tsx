import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Tag,
  Users,
  Puzzle,
  ArrowLeft,
  Save,
  Plus,
  Image,
  Video,
  Trash2,
  Edit,
  Percent,
  DollarSign,
  TrendingUp,
  UserCheck,
  Check,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  commission: number;
  activeClients: number;
  churn: number;
  mrr: number;
  status: string;
  model: "recurring" | "whitelabel";
  totalSales?: number;
  totalRevenue?: number;
  images?: string[];
  videoUrl?: string;
  supportEmail?: string;
  supportUrl?: string;
  autoApproval?: boolean;
}

interface ProductManagementPanelProps {
  product: Product;
  onBack: () => void;
}

const tabs = [
  { id: "settings", label: "Configurações", icon: Settings },
  { id: "offers", label: "Ofertas", icon: Tag },
  { id: "affiliation", label: "Afiliação", icon: Users },
  { id: "integrations", label: "Integrações", icon: Puzzle },
];

const mockOffers = [
  { id: 1, name: "Plano Mensal", type: "Recorrente", price: 197, status: "active" },
  { id: 2, name: "Plano Anual", type: "Recorrente", price: 1970, status: "active" },
  { id: 3, name: "BLACKFRIDAY30", type: "Cupom", price: -30, status: "active" },
];

interface AffiliateData {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  profile?: {
    name: string;
    email: string;
  };
  sales_count?: number;
  revenue?: number;
  commission_paid?: number;
}

interface AffiliationTabProps {
  product: Product;
  autoApproval: boolean;
  setAutoApproval: (value: boolean) => void;
  globalCommission: number;
  setGlobalCommission: (value: number) => void;
}

function AffiliationTabContent({ product, autoApproval, setAutoApproval, globalCommission, setGlobalCommission }: AffiliationTabProps) {
  const [affiliates, setAffiliates] = useState<AffiliateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalAffiliates: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalCommission: 0,
  });

  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        setLoading(true);
        // Fetch affiliations for this product
        const { data: affiliations, error } = await supabase
          .from('affiliations')
          .select('*')
          .eq('product_id', String(product.id));

        if (error) throw error;

        // Fetch sales data for these affiliates
        const { data: sales } = await supabase
          .from('sales')
          .select('*')
          .eq('product_id', String(product.id));

        // Calculate metrics per affiliate
        const affiliateMap = new Map<string, AffiliateData>();
        
        affiliations?.forEach(aff => {
          const affiliateSales = sales?.filter(s => s.affiliate_id === aff.user_id) || [];
          const revenue = affiliateSales.reduce((sum, s) => sum + Number(s.amount), 0);
          const commission = affiliateSales.reduce((sum, s) => sum + Number(s.commission_amount), 0);
          
          affiliateMap.set(aff.id, {
            ...aff,
            sales_count: affiliateSales.length,
            revenue,
            commission_paid: commission,
          });
        });

        const affiliatesList = Array.from(affiliateMap.values());
        setAffiliates(affiliatesList);

        // Calculate totals
        const activeAffiliates = affiliatesList.filter(a => a.status === 'approved' || a.status === 'active');
        setMetrics({
          totalAffiliates: activeAffiliates.length,
          totalSales: affiliatesList.reduce((sum, a) => sum + (a.sales_count || 0), 0),
          totalRevenue: affiliatesList.reduce((sum, a) => sum + (a.revenue || 0), 0),
          totalCommission: affiliatesList.reduce((sum, a) => sum + (a.commission_paid || 0), 0),
        });
      } catch (error) {
        console.error('Error fetching affiliates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliates();
  }, [product.id]);

  const pendingAffiliates = affiliates.filter(a => a.status === 'pending');
  const activeAffiliates = affiliates.filter(a => a.status === 'approved' || a.status === 'active');

  const handleApprove = async (affiliateId: string) => {
    try {
      await supabase
        .from('affiliations')
        .update({ status: 'approved' })
        .eq('id', affiliateId);
      
      setAffiliates(prev => prev.map(a => 
        a.id === affiliateId ? { ...a, status: 'approved' } : a
      ));
      
      toast({
        title: "Afiliado aprovado!",
        description: "O afiliado foi aprovado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o afiliado.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (affiliateId: string) => {
    try {
      await supabase
        .from('affiliations')
        .update({ status: 'rejected' })
        .eq('id', affiliateId);
      
      setAffiliates(prev => prev.map(a => 
        a.id === affiliateId ? { ...a, status: 'rejected' } : a
      ));
      
      toast({
        title: "Afiliado rejeitado",
        description: "A solicitação foi recusada.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar o afiliado.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Configurações de Afiliação</h3>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Afiliados Ativos</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{metrics.totalAffiliates}</p>
        </div>
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground">Vendas por Afiliados</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{metrics.totalSales}</p>
        </div>
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-warning" />
            <span className="text-xs text-muted-foreground">Receita Gerada</span>
          </div>
          <p className="text-2xl font-bold text-foreground">R$ {metrics.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-4 h-4 text-destructive" />
            <span className="text-xs text-muted-foreground">Comissão Paga</span>
          </div>
          <p className="text-2xl font-bold text-foreground">R$ {metrics.totalCommission.toFixed(2)}</p>
        </div>
      </div>

      {/* Global Commission */}
      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
        <Label className="flex items-center gap-2 mb-3">
          <Percent className="w-4 h-4 text-primary" />
          Comissão Global do Afiliado
        </Label>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            value={globalCommission}
            onChange={(e) => setGlobalCommission(Number(e.target.value))}
            className="bg-background border-border w-32"
            min={0}
            max={100}
          />
          <span className="text-muted-foreground">%</span>
          <p className="text-sm text-muted-foreground flex-1">
            Esta comissão será aplicada a todas as vendas feitas por afiliados.
          </p>
        </div>
      </div>

      {/* Approval Mode */}
      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Modo de Aprovação de Afiliados
            </Label>
            <p className="text-sm text-muted-foreground">
              {autoApproval
                ? "Afiliados são aprovados automaticamente ao solicitar afiliação."
                : "Você precisará aprovar manualmente cada solicitação de afiliação."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm ${!autoApproval ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Manual
            </span>
            <Switch
              checked={autoApproval}
              onCheckedChange={setAutoApproval}
            />
            <span className={`text-sm ${autoApproval ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Automática
            </span>
          </div>
        </div>
      </div>

      {/* Pending Affiliations */}
      <div className="pt-4 border-t border-border">
        <h4 className="font-medium text-foreground mb-3">Solicitações Pendentes</h4>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Carregando...</p>
          </div>
        ) : pendingAffiliates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma solicitação pendente</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Afiliado</TableHead>
                <TableHead className="text-muted-foreground">Data</TableHead>
                <TableHead className="text-muted-foreground text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingAffiliates.map((affiliate) => (
                <TableRow key={affiliate.id} className="border-border hover:bg-secondary/50 transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{affiliate.profile?.name || 'Afiliado'}</p>
                      <p className="text-xs text-muted-foreground">{affiliate.profile?.email || affiliate.user_id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(affiliate.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(affiliate.id)}
                        className="h-7 text-xs bg-success hover:bg-success/90"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Aprovar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleReject(affiliate.id)}
                        className="h-7 text-xs"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Active Affiliates */}
      <div className="pt-4 border-t border-border">
        <h4 className="font-medium text-foreground mb-3">Afiliados Ativos</h4>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Carregando...</p>
          </div>
        ) : activeAffiliates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum afiliado ativo ainda</p>
            <p className="text-xs mt-1">Compartilhe seu produto no Marketplace para atrair afiliados</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Afiliado</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Vendas</TableHead>
                <TableHead className="text-muted-foreground">Receita</TableHead>
                <TableHead className="text-muted-foreground">Comissão</TableHead>
                <TableHead className="text-muted-foreground">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeAffiliates.map((affiliate) => (
                <TableRow key={affiliate.id} className="border-border hover:bg-secondary/50 transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{affiliate.profile?.name || 'Afiliado'}</p>
                      <p className="text-xs text-muted-foreground">{affiliate.profile?.email || affiliate.user_id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-success/10 text-success border-0">Ativo</Badge>
                  </TableCell>
                  <TableCell className="text-foreground">{affiliate.sales_count || 0}</TableCell>
                  <TableCell className="text-foreground">R$ {(affiliate.revenue || 0).toFixed(2)}</TableCell>
                  <TableCell className="text-warning">R$ {(affiliate.commission_paid || 0).toFixed(2)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(affiliate.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export function ProductManagementPanel({ product, onBack }: ProductManagementPanelProps) {
  const [activeTab, setActiveTab] = useState("settings");
  const [autoApproval, setAutoApproval] = useState(product.autoApproval ?? true);
  const [productName, setProductName] = useState(product.name);
  const [productDescription, setProductDescription] = useState(product.description);
  const [supportEmail, setSupportEmail] = useState(product.supportEmail || "suporte@exemplo.com");
  const [supportUrl, setSupportUrl] = useState(product.supportUrl || "https://suporte.exemplo.com");
  const [globalCommission, setGlobalCommission] = useState(product.commission);
  const [pixelFacebook, setPixelFacebook] = useState("");
  const [pixelGoogle, setPixelGoogle] = useState("");
  const [mediaImages, setMediaImages] = useState<string[]>(product.images || [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
  ]);
  const [videoUrl, setVideoUrl] = useState(product.videoUrl || "");

  const handleSave = () => {
    toast({
      title: "Alterações salvas!",
      description: "As configurações do produto foram atualizadas.",
    });
  };

  const handleAddImage = () => {
    const newImage = prompt("Cole a URL da imagem:");
    if (newImage) {
      setMediaImages([...mediaImages, newImage]);
      toast({
        title: "Imagem adicionada!",
        description: "A imagem foi adicionada à galeria do produto.",
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setMediaImages(mediaImages.filter((_, i) => i !== index));
    toast({
      title: "Imagem removida!",
      description: "A imagem foi removida da galeria.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
          <p className="text-sm text-muted-foreground">Gerenciamento do Produto</p>
        </div>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 transition-colors">
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      {/* Kirvano-style vertical tabs layout */}
      <div className="flex gap-6">
        {/* Vertical Tab Navigation */}
        <div className="w-56 flex-shrink-0">
          <div className="glass-card p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 glass-card p-6">
          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Informações Básicas</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Produto</Label>
                    <Input
                      id="name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      className="bg-secondary border-border resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Image className="w-5 h-5 text-primary" />
                  Mídia de Apresentação
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Adicione imagens e vídeo que serão exibidos na vitrine do Marketplace.
                </p>

                {/* Images Gallery */}
                <div className="space-y-4">
                  <Label>Fotos do Produto</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {mediaImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-border"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1.5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddImage}
                      className="w-full h-24 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-xs">Adicionar</span>
                    </button>
                  </div>
                </div>

                {/* Video URL */}
                <div className="space-y-2 mt-4">
                  <Label htmlFor="video" className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-muted-foreground" />
                    URL do Vídeo de Apresentação
                  </Label>
                  <Input
                    id="video"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
                    className="bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Vídeos do YouTube ou Vimeo são exibidos automaticamente no modal do produto.
                  </p>
                </div>
              </div>

              {/* Support Info */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Informações de Suporte</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Email de Suporte</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportUrl">URL da Central de Ajuda</Label>
                    <Input
                      id="supportUrl"
                      value={supportUrl}
                      onChange={(e) => setSupportUrl(e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Offers Tab */}
          {activeTab === "offers" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Ofertas Cadastradas</h3>
                <Button className="bg-primary hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Oferta
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Nome</TableHead>
                    <TableHead className="text-muted-foreground">Tipo</TableHead>
                    <TableHead className="text-muted-foreground">Valor</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOffers.map((offer) => (
                    <TableRow key={offer.id} className="border-border hover:bg-secondary/50 transition-colors">
                      <TableCell className="font-medium text-foreground">{offer.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border">
                          {offer.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={offer.price < 0 ? "text-success" : "text-foreground"}>
                        {offer.price < 0 ? `${offer.price}%` : `R$ ${offer.price}`}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-success/10 text-success border-0">Ativo</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="icon" variant="ghost" className="hover:bg-secondary transition-colors">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="hover:bg-destructive/10 hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Affiliation Tab */}
          {activeTab === "affiliation" && (
            <AffiliationTabContent 
              product={product} 
              autoApproval={autoApproval}
              setAutoApproval={setAutoApproval}
              globalCommission={globalCommission}
              setGlobalCommission={setGlobalCommission}
            />
          )}

          {/* Integrations Tab */}
          {activeTab === "integrations" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Pixels de Rastreamento</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pixelFb">Pixel do Facebook</Label>
                  <Input
                    id="pixelFb"
                    value={pixelFacebook}
                    onChange={(e) => setPixelFacebook(e.target.value)}
                    placeholder="Ex: 123456789012345"
                    className="bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Insira o ID do pixel do Facebook para rastrear conversões.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pixelGoogle">Pixel do Google (GA4)</Label>
                  <Input
                    id="pixelGoogle"
                    value={pixelGoogle}
                    onChange={(e) => setPixelGoogle(e.target.value)}
                    placeholder="Ex: G-XXXXXXXXXX"
                    className="bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Insira o ID de medição do Google Analytics 4.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
