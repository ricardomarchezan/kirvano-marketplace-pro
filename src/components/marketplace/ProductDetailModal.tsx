import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Package,
  RefreshCw,
  Copy,
  Play,
  Star,
  Users,
  Clock,
  ShoppingCart,
  UserPlus,
  Check,
  Info,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import { useData } from "@/contexts/DataContext";

interface Product {
  id: string;
  owner_id: string;
  name: string;
  producer: string;
  price: number;
  commission: number;
  rating: number;
  affiliates: number;
  category: string;
  model: "recurring" | "whitelabel";
  image: string;
  images?: string[];
  videoUrl?: string;
  description: string;
  benefits: string[];
  rules: string;
  auto_approve_affiliates?: boolean;
}

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const { addItem, items } = useCart();
  const { user, profile } = useAuth();
  const { addNotification } = useNotification();
  const { requestAffiliation, getAffiliationStatus, refreshData } = useData();

  if (!product) return null;

  const isInCart = items.some((item) => item.id === product.id);
  const affiliationStatus = getAffiliationStatus(product.id);
  
  // Generate affiliate link with real user ID
  const affiliateLink = user 
    ? `https://marketsaas.com/p/${product.id}?prod=${product.id}&ref=${user.id}`
    : '';

  const handleCopyLink = () => {
    if (!affiliateLink) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para copiar o link de afiliado.",
        variant: "destructive",
      });
      return;
    }
    navigator.clipboard.writeText(affiliateLink);
    toast({
      title: "Link copiado!",
      description: "O link de afiliado foi copiado para a área de transferência.",
    });
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      producer: product.producer,
      price: product.price,
      model: product.model,
      image: product.image,
    });
    toast({
      title: "Adicionado ao carrinho!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  const handleRequestAffiliation = async () => {
    if (!user || !product) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para solicitar afiliação.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Request affiliation through DataContext with proper UUID
      const result = await requestAffiliation(product.id);
      
      if (!result) {
        // Already affiliated or error handled in DataContext
        return;
      }

      // Determine if auto-approval is enabled
      const autoApproval = result.status === 'approved';

      // Create notification for the producer
      const producerNotification = {
        user_id: product.owner_id,
        type: autoApproval ? 'affiliation_approved' as const : 'affiliation_request' as const,
        title: autoApproval ? 'Novo Afiliado Aprovado' : 'Nova Solicitação de Afiliação',
        message: `${profile?.name || 'Um usuário'} (${profile?.email || user.email}) ${autoApproval ? 'foi aprovado automaticamente como afiliado' : 'solicitou afiliação'} do produto "${product.name}"`,
        data: {
          affiliation_id: result.affiliationId,
          product_id: product.id,
          product_name: product.name,
          affiliate_id: user.id,
          affiliate_name: profile?.name || 'Usuário',
          affiliate_email: profile?.email || user.email,
        },
        read: false,
      };

      addNotification(producerNotification);
      await refreshData();

      onClose();
    } catch (error) {
      // Error already handled in DataContext
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              {product.model === "recurring" ? (
                <RefreshCw className="w-5 h-5 text-primary" />
              ) : (
                <Package className="w-5 h-5 text-primary" />
              )}
            </div>
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Media Section - Enhanced with gallery and video */}
          <div className="space-y-3">
            {/* Main Media */}
            <div className="relative rounded-xl overflow-hidden">
              {product.videoUrl ? (
                <div className="w-full h-56 bg-secondary flex items-center justify-center">
                  <a
                    href={product.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-full bg-primary/90 hover:bg-primary transition-colors"
                  >
                    <Play className="w-8 h-8 text-primary-foreground" />
                  </a>
                </div>
              ) : (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />
              )}
              <Badge
                className={`absolute top-4 left-4 ${
                  product.model === "recurring"
                    ? "bg-primary/90 text-primary-foreground"
                    : "bg-warning/90 text-warning-foreground"
                }`}
              >
                {product.model === "recurring" ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Recorrência
                  </>
                ) : (
                  <>
                    <Package className="w-3 h-3 mr-1" />
                    White Label
                  </>
                )}
              </Badge>
            </div>

            {/* Image Gallery */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} - Imagem ${index + 1}`}
                    className="w-20 h-14 object-cover rounded-lg border border-border flex-shrink-0 hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{product.producer}</p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning fill-current" />
                <span className="text-sm font-medium text-foreground">{product.rating}</span>
                <span className="text-xs text-muted-foreground">• {product.affiliates} afiliados</span>
              </div>
            </div>
            <p className="text-foreground">{product.description}</p>
          </div>

          {/* Benefits */}
          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <h4 className="font-medium text-foreground mb-3">Benefícios</h4>
            <ul className="space-y-2">
              {product.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-success flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Affiliation Rules */}
          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Regras de Afiliação
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{product.rules}</p>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="text-center p-2 rounded-lg bg-background/50">
                  <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Cookie</p>
                  <p className="text-sm font-medium text-foreground">60 dias</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-background/50">
                  <RefreshCw className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Tipo</p>
                  <p className="text-sm font-medium text-foreground">
                    {product.model === "recurring" ? "Recorrente" : "Única"}
                  </p>
                </div>
                <div className="text-center p-2 rounded-lg bg-background/50">
                  <Users className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Afiliados</p>
                  <p className="text-sm font-medium text-foreground">{product.affiliates}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Commission Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20">
              <p className="text-sm text-muted-foreground mb-1">Sua Comissão</p>
              <p className="text-2xl font-bold text-success">{product.commission}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                = R$ {((product.price * product.commission) / 100).toFixed(2)} por venda
              </p>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Preço</p>
              <p className="text-2xl font-bold text-primary">
                R$ {product.price}
                {product.model === "recurring" && (
                  <span className="text-sm font-normal text-muted-foreground">/mês</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {product.model === "recurring" ? "Assinatura mensal" : "Pagamento único"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {product.model === "whitelabel" ? (
              <>
                <Button
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  className="w-full bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
                  size="lg"
                >
                  {isInCart ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Já está no carrinho
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Adicionar ao Carrinho
                    </>
                  )}
                </Button>
                {affiliationStatus !== "approved" && (
                  <Button
                    onClick={handleRequestAffiliation}
                    variant="outline"
                    disabled={affiliationStatus === "pending"}
                    className="w-full border-border hover:bg-secondary transition-all active:scale-[0.98]"
                    size="lg"
                  >
                    {affiliationStatus === "pending" ? (
                      <>
                        <Clock className="w-5 h-5 mr-2" />
                        Aguardando Aprovação
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        {affiliationStatus === "rejected" ? "Solicitar Novamente" : "Solicitar Afiliação"}
                      </>
                    )}
                  </Button>
                )}
                {affiliationStatus === "approved" && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <p className="text-sm text-success font-medium">
                      Você é afiliado deste produto
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {affiliationStatus === "approved" ? (
                  <div className="flex items-center gap-2 p-4 rounded-lg bg-success/10 border border-success/20">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <div>
                      <p className="text-sm text-success font-medium">
                        Você é afiliado deste produto!
                      </p>
                      <p className="text-xs text-success/80 mt-0.5">
                        Copie seu link abaixo para começar a promover
                      </p>
                    </div>
                  </div>
                ) : affiliationStatus === "pending" ? (
                  <Button
                    disabled
                    className="w-full bg-warning/20 text-warning border border-warning/30"
                    size="lg"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    Aguardando Aprovação do Produtor
                  </Button>
                ) : (
                  <Button
                    onClick={handleRequestAffiliation}
                    className="w-full bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
                    size="lg"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    {affiliationStatus === "rejected" ? "Solicitar Novamente" : "Solicitar Afiliação"}
                  </Button>
                )}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                  <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    A afiliação pode ser de <strong>Aprovação Imediata</strong> ou{" "}
                    <strong>Aprovação Manual</strong> a critério do Produtor.
                  </p>
                </div>
              </>
            )}

            {/* Affiliate Link Section - Only show when approved */}
            {affiliationStatus === "approved" && (
              <div className="pt-3 border-t border-border">
                <label className="text-sm font-medium text-foreground block mb-2">
                  Seu Link de Afiliado
                </label>
                {user ? (
                  <div className="flex gap-2">
                    <Input
                      value={affiliateLink}
                      readOnly
                      className="bg-secondary border-border text-sm"
                    />
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      className="border-border shrink-0 hover:bg-secondary transition-all active:scale-[0.98]"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <p className="text-sm text-warning">
                      Você precisa estar logado para gerar um link de afiliado
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
