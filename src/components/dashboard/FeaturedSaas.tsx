import { ArrowRight, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const featuredProducts = [
  {
    id: 1,
    name: "CloudCRM Pro",
    producer: "TechSolutions",
    price: "R$ 197/mês",
    commission: "30%",
    rating: 4.9,
    affiliates: 234,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "AutoEmail AI",
    producer: "MailPro Inc",
    price: "R$ 97/mês",
    commission: "40%",
    rating: 4.7,
    affiliates: 189,
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "DataAnalytics",
    producer: "InsightHub",
    price: "R$ 297/mês",
    commission: "25%",
    rating: 4.8,
    affiliates: 156,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop",
  },
];

export function FeaturedSaas() {
  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Marketplace de SaaS</h2>
          <p className="text-sm text-muted-foreground">Produtos em destaque para promover</p>
        </div>
        <Link to="/marketplace">
          <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10">
            Ver todos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 text-warning">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-medium">{product.rating}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{product.producer}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {product.affiliates} afiliados
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">{product.price}</p>
              <p className="text-sm text-success font-medium">{product.commission} comissão</p>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Promover
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
