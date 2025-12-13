import { TrendingUp, Wallet, Clock, ArrowUpRight, Loader2 } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

export function FinancialSummary() {
  const { profile } = useAuth();
  const { metrics, loading } = useData();

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-muted-foreground text-sm">Bem-vindo de volta,</p>
          <h1 className="text-2xl font-bold text-foreground mt-1">
            {profile?.name || "Usuário"}
          </h1>
        </div>
        {metrics.totalRevenue > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium">
            <ArrowUpRight size={16} />
            Ativo
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Faturamento Bruto</span>
          </div>
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(metrics.totalRevenue)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total de vendas</p>
            </>
          )}
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-success/20 to-success/5 border border-success/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-success/20">
              <Wallet className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Saldo Disponível</span>
          </div>
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(metrics.availableBalance)}
              </p>
              <p className="text-xs text-success mt-1">Liberado para saque</p>
            </>
          )}
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-warning/20 to-warning/5 border border-warning/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-warning/20">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <span className="text-sm text-muted-foreground">Saldo Pendente</span>
          </div>
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(metrics.pendingBalance)}
              </p>
              <p className="text-xs text-warning mt-1">Em análise de chargeback</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
