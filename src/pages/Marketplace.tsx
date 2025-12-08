import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Star, Users, Copy, ExternalLink, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const saasProducts = [
  {
    id: 1,
    name: "CloudCRM Pro",
    producer: "TechSolutions",
    price: "R$ 197/mês",
    commission: 30,
    rating: 4.9,
    affiliates: 234,
    category: "CRM",
  },
  {
    id: 2,
    name: "AutoEmail AI",
    producer: "MailPro Inc",
    price: "R$ 97/mês",
    commission: 40,
    rating: 4.7,
    affiliates: 189,
    category: "Email Marketing",
  },
  {
    id: 3,
    name: "DataAnalytics",
    producer: "InsightHub",
    price: "R$ 297/mês",
    commission: 25,
    rating: 4.8,
    affiliates: 156,
    category: "Analytics",
  },
  {
    id: 4,
    name: "TaskFlow Pro",
    producer: "ProductivityLabs",
    price: "R$ 47/mês",
    commission: 35,
    rating: 4.6,
    affiliates: 312,
    category: "Produtividade",
  },
  {
    id: 5,
    name: "SocialManager",
    producer: "MediaTech",
    price: "R$ 147/mês",
    commission: 28,
    rating: 4.5,
    affiliates: 178,
    category: "Social Media",
  },
  {
    id: 6,
    name: "InvoiceMaster",
    producer: "FinanceTools",
    price: "R$ 67/mês",
    commission: 45,
    rating: 4.8,
    affiliates: 245,
    category: "Finanças",
  },
];

const Marketplace = () => {
  const handleCopyLink = (productId: number) => {
    const link = `https://marketsaas.com/p/${productId}?prod=${productId}&ref=joao123`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: "O link de afiliado foi copiado para a área de transferência.",
    });
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
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <Button variant="outline" className="border-border">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Produto</TableHead>
                <TableHead className="text-muted-foreground">Produtor</TableHead>
                <TableHead className="text-muted-foreground">Categoria</TableHead>
                <TableHead className="text-muted-foreground">Preço</TableHead>
                <TableHead className="text-muted-foreground">Comissão</TableHead>
                <TableHead className="text-muted-foreground">Avaliação</TableHead>
                <TableHead className="text-muted-foreground text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {saasProducts.map((product) => (
                <TableRow key={product.id} className="border-border hover:bg-secondary/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {product.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.producer}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full bg-secondary text-xs font-medium text-foreground">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{product.price}</TableCell>
                  <TableCell>
                    <span className="text-success font-semibold">{product.commission}%</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-current" />
                      <span className="text-foreground">{product.rating}</span>
                      <span className="text-muted-foreground text-xs ml-1">
                        ({product.affiliates})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyLink(product.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Promover
                        <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;
