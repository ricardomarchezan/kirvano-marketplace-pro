import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProductDetailModal } from "@/components/marketplace/ProductDetailModal";
import { 
  Search, 
  Star, 
  Play, 
  RefreshCw, 
  Package,
  Check,
  ShoppingCart,
  UserPlus
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

type BusinessModel = "all" | "recurring" | "whitelabel";

const saasProducts = [
  {
    id: 1,
    name: "CloudCRM Pro",
    producer: "TechSolutions",
    price: 197,
    commission: 30,
    rating: 4.9,
    affiliates: 234,
    category: "CRM",
    model: "recurring" as const,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    description: "Plataforma completa de CRM com automação de vendas e relatórios avançados.",
    benefits: ["Automação de follow-up", "Relatórios em tempo real", "Integração com WhatsApp"],
    rules: "Comissão paga mensalmente enquanto o cliente estiver ativo. Cookie de 60 dias.",
  },
  {
    id: 2,
    name: "AutoEmail AI",
    producer: "MailPro Inc",
    price: 97,
    commission: 40,
    rating: 4.7,
    affiliates: 189,
    category: "Email Marketing",
    model: "recurring" as const,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=250&fit=crop",
    description: "Email marketing com inteligência artificial para maximizar conversões.",
    benefits: ["IA para assuntos", "Templates prontos", "Automação avançada"],
    rules: "Comissão recorrente de 40%. Mínimo de R$50 para saque.",
  },
  {
    id: 3,
    name: "SaaS Template Pro",
    producer: "DevStudio",
    price: 497,
    commission: 25,
    rating: 4.8,
    affiliates: 156,
    category: "Templates",
    model: "whitelabel" as const,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    description: "Template completo de SaaS pronto para personalização e revenda.",
    benefits: ["Código fonte completo", "Documentação detalhada", "Suporte por 6 meses"],
    rules: "Venda única. Licença transferida para o comprador após pagamento.",
  },
  {
    id: 4,
    name: "TaskFlow Pro",
    producer: "ProductivityLabs",
    price: 47,
    commission: 35,
    rating: 4.6,
    affiliates: 312,
    category: "Produtividade",
    model: "recurring" as const,
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=250&fit=crop",
    description: "Gestão de tarefas e projetos para equipes de alta performance.",
    benefits: ["Kanban e Gantt", "Time tracking", "Colaboração em tempo real"],
    rules: "Comissão de 35% no primeiro mês, 20% nos meses seguintes.",
  },
  {
    id: 5,
    name: "App Builder Kit",
    producer: "NoCodeLabs",
    price: 997,
    commission: 30,
    rating: 4.5,
    affiliates: 178,
    category: "Desenvolvimento",
    model: "whitelabel" as const,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop",
    description: "Kit completo para criar aplicativos sem código, pronto para revenda.",
    benefits: ["Drag & drop builder", "APIs integradas", "White label completo"],
    rules: "Licença perpétua. Revenda permitida. Sem royalties.",
  },
  {
    id: 6,
    name: "InvoiceMaster",
    producer: "FinanceTools",
    price: 67,
    commission: 45,
    rating: 4.8,
    affiliates: 245,
    category: "Finanças",
    model: "recurring" as const,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
    description: "Sistema de faturamento e gestão financeira automatizada.",
    benefits: ["Notas fiscais automáticas", "Controle de recebimentos", "Relatórios fiscais"],
    rules: "Maior comissão do marketplace! 45% recorrente.",
  },
];

const Marketplace = () => {
  const [filter, setFilter] = useState<BusinessModel>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<typeof saasProducts[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem, items } = useCart();

  const filteredProducts = saasProducts.filter((product) => {
    const matchesFilter = filter === "all" || product.model === filter;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.producer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCardClick = (product: typeof saasProducts[0]) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleQuickAddToCart = (e: React.MouseEvent, product: typeof saasProducts[0]) => {
    e.stopPropagation();
    const isInCart = items.some((item) => item.id === product.id);
    if (isInCart) {
      toast({
        title: "Já está no carrinho",
        description: `${product.name} já foi adicionado ao carrinho.`,
      });
      return;
    }
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

  const handleQuickRequestAffiliation = (e: React.MouseEvent, product: typeof saasProducts[0]) => {
    e.stopPropagation();
    toast({
      title: "Solicitação enviada!",
      description: `Sua solicitação de afiliação para ${product.name} foi enviada.`,
    });
  };

  const isProductInCart = (productId: number) => items.some((item) => item.id === productId);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
            <p className="text-muted-foreground mt-1">
              Encontre SaaS para promover e ganhar comissões
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Model Filter Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className={`transition-all active:scale-95 ${filter === "all" ? "bg-primary hover:bg-primary/90" : "border-border hover:bg-secondary"}`}
              >
                Todos
              </Button>
              <Button
                variant={filter === "recurring" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("recurring")}
                className={`transition-all active:scale-95 ${filter === "recurring" ? "bg-primary hover:bg-primary/90" : "border-border hover:bg-secondary"}`}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recorrência
              </Button>
              <Button
                variant={filter === "whitelabel" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("whitelabel")}
                className={`transition-all active:scale-95 ${filter === "whitelabel" ? "bg-primary hover:bg-primary/90" : "border-border hover:bg-secondary"}`}
              >
                <Package className="w-4 h-4 mr-2" />
                White Label
              </Button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleCardClick(product)}
              className="glass-card overflow-hidden group hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Product Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                
                {/* Model Badge */}
                <Badge
                  variant="secondary"
                  className={`absolute top-3 left-3 ${
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

                {/* Play button for video preview */}
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 text-foreground" />
                </button>

                {/* Category */}
                <span className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-secondary/90 text-xs font-medium text-foreground">
                  {product.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.producer}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-current" />
                    <span className="text-sm font-medium text-foreground">{product.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {product.description}
                </p>

                {/* Benefits */}
                <ul className="space-y-1.5 mb-4">
                  {product.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-success flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* Price and Commission */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xl font-bold text-foreground">
                      R$ {product.price}
                      {product.model === "recurring" && (
                        <span className="text-sm font-normal text-muted-foreground">/mês</span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-success font-semibold">
                        {product.commission}% comissão
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {product.affiliates} afiliados
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Button based on model */}
                  {product.model === "whitelabel" ? (
                    <Button
                      size="sm"
                      onClick={(e) => handleQuickAddToCart(e, product)}
                      disabled={isProductInCart(product.id)}
                      className={`transition-all active:scale-95 ${
                        isProductInCart(product.id)
                          ? "bg-success/20 text-success border border-success/30"
                          : "bg-primary hover:bg-primary/90"
                      }`}
                    >
                      {isProductInCart(product.id) ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1.5" />
                          No Carrinho
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                          Comprar
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={(e) => handleQuickRequestAffiliation(e, product)}
                      className="bg-primary hover:bg-primary/90 transition-all active:scale-95"
                    >
                      <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                      Afiliar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar seus filtros ou buscar por outros termos.
            </p>
          </div>
        )}

        {/* Product Detail Modal */}
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;
