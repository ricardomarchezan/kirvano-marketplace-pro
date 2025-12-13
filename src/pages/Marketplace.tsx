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
  UserPlus,
  Loader2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useData, Product } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

type BusinessModel = "all" | "recurring" | "whitelabel";

const Marketplace = () => {
  const { allProducts, affiliations, loading, requestAffiliation } = useData();
  const { user } = useAuth();
  const [filter, setFilter] = useState<BusinessModel>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestingAffiliation, setRequestingAffiliation] = useState<string | null>(null);
  const { addItem, items } = useCart();

  const filteredProducts = allProducts.filter((product) => {
    // Don't show own products
    if (product.owner_id === user?.id) return false;
    
    const matchesFilter = filter === "all" || product.model === filter;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesFilter && matchesSearch;
  });

  const handleCardClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleQuickAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const isInCart = items.some((item) => String(item.id) === product.id);
    if (isInCart) {
      toast({
        title: "Já está no carrinho",
        description: `${product.name} já foi adicionado ao carrinho.`,
      });
      return;
    }
    addItem({
      id: Number(product.id) || product.id as any,
      name: product.name,
      producer: "Produtor",
      price: Number(product.price),
      model: product.model,
      image: product.image_url || "",
    });
    toast({
      title: "Adicionado ao carrinho!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  const handleQuickRequestAffiliation = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setRequestingAffiliation(product.id);
    try {
      await requestAffiliation(product.id);
    } finally {
      setRequestingAffiliation(null);
    }
  };

  const isProductInCart = (productId: string) => items.some((item) => String(item.id) === productId);
  const isAffiliated = (productId: string) => affiliations.some((a) => a.product_id === productId);

  const generateAffiliateLink = (productId: string) => {
    return `${window.location.origin}/p/${productId}?prod=${productId}&ref=${user?.id}`;
  };

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

        {/* Loading State */}
        {loading ? (
          <div className="glass-card p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground">
              {allProducts.length === 0 
                ? "Ainda não há produtos disponíveis no marketplace"
                : "Tente ajustar seus filtros ou buscar por outros termos."
              }
            </p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleCardClick(product)}
                className="glass-card overflow-hidden group hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Product Image */}
                <div className="relative h-40 overflow-hidden bg-secondary">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
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
                  {product.video_url && (
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background active:scale-95 transition-all"
                    >
                      <Play className="w-4 h-4 text-foreground" />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">Produtor</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {product.description || "Sem descrição disponível"}
                  </p>

                  {/* Price and Commission */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-xl font-bold text-foreground">
                        R$ {Number(product.price).toFixed(2)}
                        {product.model === "recurring" && (
                          <span className="text-sm font-normal text-muted-foreground">/mês</span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-success font-semibold">
                          {product.commission}% comissão
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Button based on model and affiliation status */}
                    {isAffiliated(product.id) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-success/30 text-success"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(generateAffiliateLink(product.id));
                          toast({
                            title: "Link copiado!",
                            description: "Seu link de afiliado foi copiado para a área de transferência.",
                          });
                        }}
                      >
                        <Check className="w-3.5 h-3.5 mr-1.5" />
                        Afiliado
                      </Button>
                    ) : product.model === "whitelabel" ? (
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
                        disabled={requestingAffiliation === product.id}
                        className="bg-primary hover:bg-primary/90 transition-all active:scale-95"
                      >
                        {requestingAffiliation === product.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                            Afiliar
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Detail Modal */}
        <ProductDetailModal
          product={selectedProduct ? {
            id: Number(selectedProduct.id) || 0,
            name: selectedProduct.name,
            producer: "Produtor",
            price: Number(selectedProduct.price),
            commission: Number(selectedProduct.commission),
            rating: 5,
            affiliates: 0,
            category: "SaaS",
            model: selectedProduct.model,
            image: selectedProduct.image_url || "",
            description: selectedProduct.description || "",
            benefits: [],
            rules: `Comissão de ${selectedProduct.commission}% por venda.`,
          } : null}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;
