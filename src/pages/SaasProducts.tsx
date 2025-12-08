import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Package, Users, TrendingDown, DollarSign, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

const myProducts = [
  {
    id: 1,
    name: "MeuSaaS Pro",
    description: "Plataforma completa de gestão",
    price: 197,
    commission: 30,
    activeClients: 156,
    churn: 2.3,
    mrr: 30732,
    status: "active",
  },
  {
    id: 2,
    name: "AutomationHub",
    description: "Automação de marketing inteligente",
    price: 97,
    commission: 35,
    activeClients: 89,
    churn: 3.1,
    mrr: 8633,
    status: "active",
  },
];

const SaasProducts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Novo SaaS
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-foreground">Cadastrar Novo SaaS</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto</Label>
                  <Input id="name" placeholder="Ex: MeuSaaS Pro" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva seu produto..."
                    className="bg-secondary border-border resize-none"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook">URL de Ativação (Webhook)</Label>
                  <Input
                    id="webhook"
                    placeholder="https://seusite.com/api/activate"
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço Mensal (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="197"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commission">Comissão Afiliado (%)</Label>
                    <Input
                      id="commission"
                      type="number"
                      placeholder="30"
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 mt-4">
                  Cadastrar Produto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {myProducts.map((product) => (
            <div key={product.id} className="glass-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Clientes Ativos</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{product.activeClients}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-warning" />
                    <span className="text-xs text-muted-foreground">Churn Rate</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{product.churn}%</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-success" />
                    <span className="text-xs text-muted-foreground">MRR</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">
                    R$ {product.mrr.toLocaleString("pt-BR")}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">Comissão</span>
                  </div>
                  <p className="text-xl font-bold text-success">{product.commission}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  Preço: <span className="text-foreground font-medium">R$ {product.price}/mês</span>
                </span>
                <span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                  Ativo
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SaasProducts;
