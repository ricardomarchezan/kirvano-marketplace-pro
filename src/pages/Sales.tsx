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
import { Search, Filter, Download, TrendingUp, DollarSign, Users, RefreshCw } from "lucide-react";

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
          <Button variant="outline" className="border-border">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">MRR</p>
                <p className="text-xl font-bold text-foreground">R$ 12.450</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">LTV Médio</p>
                <p className="text-xl font-bold text-foreground">R$ 2.340</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Users className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Clientes Ativos</p>
                <p className="text-xl font-bold text-foreground">234</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <RefreshCw className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Churn Rate</p>
                <p className="text-xl font-bold text-foreground">2.3%</p>
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
                <TableRow key={sale.id} className="border-border hover:bg-secondary/50">
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
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sale.status === "completed"
                          ? "bg-success/10 text-success"
                          : sale.status === "pending"
                          ? "bg-warning/10 text-warning"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {sale.status === "completed"
                        ? "Concluído"
                        : sale.status === "pending"
                        ? "Pendente"
                        : "Reembolsado"}
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
