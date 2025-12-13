import { useState, useMemo } from "react";
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
import { 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  DollarSign, 
  Users, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { subDays, parseISO, isWithinInterval } from "date-fns";
import { useData } from "@/contexts/DataContext";

const Sales = () => {
  const { sales, products, metrics, loading } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      // Date filter
      if (dateRange?.from && dateRange?.to) {
        const saleDate = parseISO(sale.created_at);
        if (!isWithinInterval(saleDate, { start: dateRange.from, end: dateRange.to })) {
          return false;
        }
      }

      // Search filter
      if (searchQuery) {
        const product = products.find(p => p.id === sale.product_id);
        const searchLower = searchQuery.toLowerCase();
        return (
          sale.id.toLowerCase().includes(searchLower) ||
          sale.customer_email.toLowerCase().includes(searchLower) ||
          product?.name.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [sales, products, dateRange, searchQuery]);

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || "Produto não encontrado";
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

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
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(metrics.mrr)}
                    </p>
                  )}
                </div>
              </div>
              {metrics.mrr > 0 && (
                <div className="flex items-center gap-1 text-success text-xs font-medium">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Ativo
                </div>
              )}
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
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(metrics.ltv)}
                    </p>
                  )}
                </div>
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
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">{metrics.activeClients}</p>
                  )}
                </div>
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
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">{metrics.churnRate.toFixed(1)}%</p>
                  )}
                </div>
              </div>
              {metrics.churnRate > 0 && (
                <div className="flex items-center gap-1 text-destructive text-xs font-medium">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {metrics.churnRate.toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                className="pl-10 bg-secondary border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            <Button variant="outline" className="border-border hover:bg-secondary transition-all active:scale-95">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="p-12 text-center">
              <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">Nenhuma venda realizada</h3>
              <p className="text-muted-foreground">
                Suas vendas aparecerão aqui assim que forem realizadas
              </p>
            </div>
          ) : (
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
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id} className="border-border hover:bg-secondary/50 transition-colors">
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {sale.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {getProductName(sale.product_id)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{sale.customer_email}</TableCell>
                    <TableCell className="font-medium text-foreground">
                      {formatCurrency(Number(sale.amount))}
                    </TableCell>
                    <TableCell className="text-success font-medium">
                      {formatCurrency(Number(sale.commission_amount))}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(sale.created_at).toLocaleDateString("pt-BR")}
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Sales;
