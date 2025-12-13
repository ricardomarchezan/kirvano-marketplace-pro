import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, Trash2, CreditCard, Package, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { items, removeItem, clearCart, total } = useCart();
  const navigate = useNavigate();

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast({
      title: "Item removido",
      description: `${name} foi removido do carrinho.`,
    });
  };

  const handleCheckout = () => {
    toast({
      title: "Pedido realizado!",
      description: "Seu pedido foi processado com sucesso.",
    });
    clearCart();
    navigate("/");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/marketplace")}
            className="hover:bg-secondary active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Carrinho de Compras</h1>
            <p className="text-muted-foreground mt-1">
              {items.length} {items.length === 1 ? "item" : "itens"} no carrinho
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">Carrinho vazio</h3>
            <p className="text-muted-foreground mb-6">
              Você ainda não adicionou nenhum produto ao carrinho.
            </p>
            <Button
              onClick={() => navigate("/marketplace")}
              className="bg-primary hover:bg-primary/90 transition-all active:scale-95"
            >
              Explorar Marketplace
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="glass-card p-4 flex items-center gap-4 hover:border-primary/30 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.producer}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Package className="w-3 h-3 text-warning" />
                          <span className="text-xs text-warning">White Label</span>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-foreground">R$ {item.price}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id, item.name)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 active:scale-95 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24">
                <h3 className="font-semibold text-foreground text-lg mb-4">Resumo do Pedido</h3>
                
                <div className="space-y-3 pb-4 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de processamento</span>
                    <span className="text-foreground">R$ 0,00</span>
                  </div>
                </div>

                <div className="flex justify-between py-4">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">R$ {total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
                  size="lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Finalizar Compra
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Pagamento seguro via Stripe
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Checkout;
