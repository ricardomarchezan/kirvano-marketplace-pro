import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Package, 
  Users, 
  TrendingDown, 
  DollarSign, 
  RefreshCw,
  FileCode,
  Key,
  Link,
  Upload,
  AlertCircle,
  Image,
  Video,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ProductManagementPanel } from "@/components/saas/ProductManagementPanel";
import { useData, Product } from "@/contexts/DataContext";

type BusinessModel = "recurring" | "whitelabel" | "";

const SaasProducts = () => {
  const { products, sales, loading, addProduct } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [businessModel, setBusinessModel] = useState<BusinessModel>("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: "",
    videoUrl: "",
    price: "",
    commission: "",
    webhookUrl: "",
    apiKey: "",
    githubUrl: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      images: "",
      videoUrl: "",
      price: "",
      commission: "",
      webhookUrl: "",
      apiKey: "",
      githubUrl: "",
    });
    setBusinessModel("");
    setAcceptTerms(false);
  };

  const handleSubmit = async () => {
    if (!businessModel) {
      toast({
        title: "Selecione o modelo",
        description: "Por favor, escolha o modelo de negócio do seu SaaS.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe o nome do produto.",
        variant: "destructive",
      });
      return;
    }

    if (businessModel === "whitelabel" && !acceptTerms) {
      toast({
        title: "Aceite os termos",
        description: "Você precisa aceitar o termo de licença para produtos White Label.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addProduct({
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price) || 0,
        commission: parseFloat(formData.commission) || 0,
        model: businessModel as "recurring" | "whitelabel",
        status: "active",
        image_url: formData.images.split(",")[0]?.trim() || null,
        video_url: formData.videoUrl || null,
        webhook_url: formData.webhookUrl || null,
        github_url: formData.githubUrl || null,
        auto_approve_affiliates: false,
      });

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error already handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate product metrics
  const getProductMetrics = (product: Product) => {
    const productSales = sales.filter(s => s.product_id === product.id);
    const completedSales = productSales.filter(s => s.status === "completed");
    const mrr = product.model === "recurring" 
      ? completedSales.reduce((sum, s) => sum + Number(s.amount), 0)
      : 0;
    const totalRevenue = completedSales.reduce((sum, s) => sum + Number(s.amount), 0);
    const activeClients = new Set(completedSales.map(s => s.customer_email)).size;
    const churn = productSales.length > 0
      ? (productSales.filter(s => s.status === "refunded" || s.status === "chargeback").length / productSales.length) * 100
      : 0;

    return { mrr, totalRevenue, activeClients, churn, totalSales: completedSales.length };
  };

  // If a product is selected, show the management panel
  if (selectedProduct) {
    return (
      <DashboardLayout>
        <ProductManagementPanel
          product={selectedProduct as any}
          onBack={() => setSelectedProduct(null)}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meus SaaS</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus produtos e acompanhe métricas
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Novo SaaS
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-foreground">Cadastrar Novo SaaS</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 mt-4">
                {/* Business Model Selection */}
                <div className="space-y-2">
                  <Label htmlFor="model" className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Modelo de Negócio *
                  </Label>
                  <Select value={businessModel} onValueChange={(value: BusinessModel) => setBusinessModel(value)}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Selecione o modelo do seu SaaS" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="recurring">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-primary" />
                          <span>Recorrência (Assinatura)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="whitelabel">
                        <div className="flex items-center gap-2">
                          <FileCode className="w-4 h-4 text-warning" />
                          <span>White Label (Venda Única)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {businessModel === "recurring" 
                      ? "Ideal para SaaS com cobrança mensal. Comissões recorrentes para afiliados."
                      : businessModel === "whitelabel"
                      ? "Ideal para templates e códigos-fonte. Venda única com licença transferida."
                      : "Escolha como seu produto será comercializado."}
                  </p>
                </div>

                {/* Common Fields */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input 
                    id="name" 
                    placeholder="Ex: MeuSaaS Pro" 
                    className="bg-secondary border-border"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva seu produto de forma atrativa para afiliados..."
                    className="bg-secondary border-border resize-none"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                {/* Media Fields */}
                <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-4">
                  <div className="flex items-center gap-2 text-foreground">
                    <Image className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Mídia de Apresentação</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="images" className="flex items-center gap-2">
                      <Image className="w-4 h-4 text-muted-foreground" />
                      URLs das Imagens (separadas por vírgula)
                    </Label>
                    <Textarea
                      id="images"
                      placeholder="https://exemplo.com/imagem1.jpg, https://exemplo.com/imagem2.jpg"
                      className="bg-background border-border resize-none"
                      rows={2}
                      value={formData.images}
                      onChange={(e) => handleInputChange("images", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoUrl" className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-muted-foreground" />
                      URL do Vídeo de Apresentação
                    </Label>
                    <Input
                      id="videoUrl"
                      placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
                      className="bg-background border-border"
                      value={formData.videoUrl}
                      onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      {businessModel === "whitelabel" ? "Preço Único (R$)" : "Preço Mensal (R$)"}
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder={businessModel === "whitelabel" ? "497" : "197"}
                      className="bg-secondary border-border"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commission">Comissão Afiliado (%)</Label>
                    <Input
                      id="commission"
                      type="number"
                      placeholder="30"
                      className="bg-secondary border-border"
                      value={formData.commission}
                      onChange={(e) => handleInputChange("commission", e.target.value)}
                    />
                  </div>
                </div>

                {/* Recurring-specific fields */}
                {businessModel === "recurring" && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-primary">
                      <RefreshCw className="w-4 h-4" />
                      <span className="font-medium text-sm">Configurações de Recorrência</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="webhook" className="flex items-center gap-2">
                        <Link className="w-4 h-4 text-muted-foreground" />
                        URL de Ativação (Webhook) *
                      </Label>
                      <Input
                        id="webhook"
                        placeholder="https://seusite.com/api/activate"
                        className="bg-secondary border-border"
                        value={formData.webhookUrl}
                        onChange={(e) => handleInputChange("webhookUrl", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Endpoint que será chamado quando um cliente ativar a assinatura.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apikey" className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-muted-foreground" />
                        Chave Secreta de API *
                      </Label>
                      <Input
                        id="apikey"
                        type="password"
                        placeholder="sk_live_..."
                        className="bg-secondary border-border"
                        value={formData.apiKey}
                        onChange={(e) => handleInputChange("apiKey", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Chave para autenticação segura entre nossa plataforma e seu sistema.
                      </p>
                    </div>
                  </div>
                )}

                {/* White Label-specific fields */}
                {businessModel === "whitelabel" && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-warning">
                      <FileCode className="w-4 h-4" />
                      <span className="font-medium text-sm">Configurações White Label</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="download" className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-muted-foreground" />
                        Arquivo ZIP ou Link GitHub *
                      </Label>
                      <Input
                        id="download"
                        placeholder="https://github.com/user/repo ou faça upload..."
                        className="bg-secondary border-border"
                        value={formData.githubUrl}
                        onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Link para download do código-fonte após a compra.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-foreground text-sm">Termo de Licença White Label</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Ao cadastrar um produto White Label, você declara que:
                            </p>
                            <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                              <li>Possui direitos sobre o código-fonte</li>
                              <li>A licença será transferida para o comprador após a venda</li>
                              <li>O comprador poderá modificar e revender sob sua própria marca</li>
                            </ul>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="terms" 
                              checked={acceptTerms}
                              onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                            />
                            <label
                              htmlFor="terms"
                              className="text-sm font-medium leading-none text-foreground cursor-pointer"
                            >
                              Aceito os termos de licença White Label
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleSubmit}
                  className="w-full bg-primary hover:bg-primary/90 mt-4 transition-colors"
                  disabled={!businessModel || (businessModel === "whitelabel" && !acceptTerms) || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    "Cadastrar Produto"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="glass-card p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="glass-card p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">Nenhum SaaS cadastrado</h3>
            <p className="text-muted-foreground mb-6">
              Comece cadastrando seu primeiro produto SaaS
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Meu Primeiro SaaS
            </Button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.map((product) => {
              const metrics = getProductMetrics(product);
              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="glass-card p-6 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        product.model === "recurring" 
                          ? "bg-gradient-to-br from-primary/20 to-primary/5" 
                          : "bg-gradient-to-br from-warning/20 to-warning/5"
                      }`}>
                        {product.model === "recurring" ? (
                          <RefreshCw className="w-6 h-6 text-primary" />
                        ) : (
                          <FileCode className="w-6 h-6 text-warning" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{product.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            product.model === "recurring"
                              ? "bg-primary/10 text-primary"
                              : "bg-warning/10 text-warning"
                          }`}>
                            {product.model === "recurring" ? "Recorrência" : "White Label"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {product.model === "recurring" ? (
                      <>
                        <div className="p-3 rounded-lg bg-secondary/50">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-xs text-muted-foreground">Clientes Ativos</span>
                          </div>
                          <p className="text-lg font-semibold text-foreground">{metrics.activeClients}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingDown className="w-4 h-4 text-destructive" />
                            <span className="text-xs text-muted-foreground">Churn</span>
                          </div>
                          <p className="text-lg font-semibold text-foreground">{metrics.churn.toFixed(1)}%</p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50 col-span-2">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-success" />
                            <span className="text-xs text-muted-foreground">MRR</span>
                          </div>
                          <p className="text-xl font-bold text-success">
                            R$ {metrics.mrr.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 rounded-lg bg-secondary/50">
                          <div className="flex items-center gap-2 mb-1">
                            <Package className="w-4 h-4 text-warning" />
                            <span className="text-xs text-muted-foreground">Total Vendas</span>
                          </div>
                          <p className="text-lg font-semibold text-foreground">{metrics.totalSales}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-success" />
                            <span className="text-xs text-muted-foreground">Receita Total</span>
                          </div>
                          <p className="text-lg font-semibold text-success">
                            R$ {metrics.totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>R$ {Number(product.price).toFixed(2)}{product.model === "recurring" ? "/mês" : ""}</span>
                      <span>{product.commission}% comissão</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === "active"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {product.status === "active" ? "Ativo" : "Pausado"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SaasProducts;
