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
import { Search, Filter, Download, TrendingUp, DollarSign, Users, RefreshCw, ArrowUpRight, ArrowDownRight } from "lucide-react";

const sales = [
  {
    id: "TXN-001",
    product: "CloudCRM Pro",
    customer: "maria@empresa.com",
    amount: 197,
    commission: 59.1,
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "TXN-002",
    product: "AutoEmail AI",
    customer: "joao@startup.com",
    amount: 97,
    commission: 38.8,
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: "TXN-003",
    product: "DataAnalytics",
    customer: "ana@corp.com",
    amount: 297,
    commission: 74.25,
    date: "2024-01-13",
    status: "pending",
  },
  {
    id: "TXN-004",
    product: "TaskFlow Pro",
    customer: "pedro@agencia.com",
    amount: 47,
    commission: 16.45,
    date: "2024-01-12",
    status: "completed",
  },
  {
    id: "TXN-005",
    product: "CloudCRM Pro",
    customer: "lucia@tech.com",
    amount: 197,
    commission: 59.1,
    date: "2024-01-11",
    status: "refunded",
  },
  {
    id: "TXN-006",
    product: "SaaS Template Pro",
    customer: "carlos@dev.com",
    amount: 497,
    commission: 124.25,
    date: "2024-01-10",
    status: "completed",
  },
  {
    id: "TXN-007",
    product: "InvoiceMaster",
    customer: "fernanda@contabil.com",
    amount: 67,
    commission: 30.15,
    date: "2024-01-09",
    status: "chargeback",
  },
];

const Sales = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Vendas</h1>
            <p className="text-muted-foreground mt-1">
              Histórico de transações e métricas de vendas
            </p>
          </div>
          <Button variant="outline" className="border-border hover:bg-secondary transition-all active:scale-95">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">MRR</p>
                  <p className="text-2xl font-bold text-foreground">R$ 12.450</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-success text-xs font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                12%
              </div>
            </div>
          </div>
          <div className="glass-card p-5 hover:border-success/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-success/10">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">LTV Médio</p>
                  <p className="text-2xl font-bold text-foreground">R$ 2.340</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-success text-xs font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                8%
              </div>
            </div>
          </div>
          <div className="glass-card p-5 hover:border-warning/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-warning/10">
                  <Users className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Clientes Ativos</p>
                  <p className="text-2xl font-bold text-foreground">234</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-success text-xs font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                5%
              </div>
            </div>
          </div>
          <div className="glass-card p-5 hover:border-destructive/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-destructive/10">
                  <RefreshCw className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Churn Rate</p>
                  <p className="text-2xl font-bold text-foreground">2.3%</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-destructive text-xs font-medium">
                <ArrowDownRight className="w-3.5 h-3.5" />
                0.5%
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <Button variant="outline" className="border-border hover:bg-secondary transition-all active:scale-95">
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
                <TableHead className="text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">Produto</TableHead>
                <TableHead className="text-muted-foreground">Cliente</TableHead>
                <TableHead className="text-muted-foreground">Valor</TableHead>
                <TableHead className="text-muted-foreground">Comissão</TableHead>
                <TableHead className="text-muted-foreground">Data</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id} className="border-border hover:bg-secondary/50 transition-colors">
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {sale.id}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{sale.product}</TableCell>
                  <TableCell className="text-muted-foreground">{sale.customer}</TableCell>
                  <TableCell className="font-medium text-foreground">
                    R$ {sale.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-success font-medium">
                    R$ {sale.commission.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(sale.date).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                        sale.status === "completed"
                          ? "bg-success/10 text-success"
                          : sale.status === "pending"
                          ? "bg-warning/10 text-warning"
                          : sale.status === "refunded"
                          ? "bg-muted text-muted-foreground"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        sale.status === "completed"
                          ? "bg-success"
                          : sale.status === "pending"
                          ? "bg-warning"
                          : sale.status === "refunded"
                          ? "bg-muted-foreground"
                          : "bg-destructive"
                      }`} />
                      {sale.status === "completed"
                        ? "Concluído"
                        : sale.status === "pending"
                        ? "Pendente"
                        : sale.status === "refunded"
                        ? "Reembolsado"
                        : "Chargeback"}
                    </span>
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

export default Sales;
