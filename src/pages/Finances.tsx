import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CreditCard,
  Building2,
  CheckCircle2,
  RotateCcw,
  XCircle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useData, Transaction } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

type TransactionType = "credit" | "debit" | "refund" | "withdrawal";
type TransactionStatus = "completed" | "pending";

const getTransactionStyles = (type: TransactionType, status: TransactionStatus) => {
  if (type === "refund") {
    return {
      bg: "bg-muted/50",
      icon: RotateCcw,
      iconColor: "text-muted-foreground",
      amountColor: "text-muted-foreground",
      prefix: "-",
    };
  }
  if (type === "credit") {
    return {
      bg: "bg-success/10",
      icon: ArrowUpRight,
      iconColor: "text-success",
      amountColor: "text-success",
      prefix: "+",
    };
  }
  return {
    bg: "bg-destructive/10",
    icon: ArrowDownRight,
    iconColor: "text-destructive",
    amountColor: "text-destructive",
    prefix: "-",
  };
};

const getStatusBadge = (status: TransactionStatus) => {
  switch (status) {
    case "completed":
      return (
        <Badge variant="secondary" className="bg-success/10 text-success border-0">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Concluído
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="secondary" className="bg-warning/10 text-warning border-0">
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>
      );
  }
};

const Finances = () => {
  const { transactions, metrics, loading } = useData();
  const { profile } = useAuth();

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
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finanças</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seu saldo e configure recebimentos
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-success/10 glow-success">
                  <Wallet className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Disponível</p>
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-foreground">
                      {formatCurrency(metrics.availableBalance)}
                    </p>
                  )}
                </div>
              </div>
              <Button 
                className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold"
                disabled={metrics.availableBalance <= 0}
              >
                Solicitar Saque
              </Button>
            </div>
          </div>

          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-warning/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Pendente</p>
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-foreground">
                      {formatCurrency(metrics.pendingBalance)}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Liberado em até 14 dias após a compra
              </p>
            </div>
          </div>

          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 glow-primary">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sacado</p>
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-foreground">
                      {formatCurrency(metrics.totalWithdrawn)}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Desde o início da conta</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transactions */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Extrato Detalhado</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-xs text-muted-foreground">Comissões</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-xs text-muted-foreground">Saques</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Reembolsos</span>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhuma transação ainda</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Suas transações aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => {
                  const styles = getTransactionStyles(transaction.type as TransactionType, transaction.status as TransactionStatus);
                  const Icon = styles.icon;
                  
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/80 transition-colors"
                      style={{ backgroundColor: `hsl(var(--secondary) / 0.5)` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${styles.bg}`}>
                          <Icon className={`w-5 h-5 ${styles.iconColor}`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className={`font-semibold text-lg ${styles.amountColor}`}>
                            {styles.prefix} {formatCurrency(Number(transaction.amount))}
                          </p>
                        </div>
                        {getStatusBadge(transaction.status as TransactionStatus)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Configuration */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Configurar Recebimento
            </h2>
            <div className="space-y-4">
              {/* Stripe Connect */}
              <div className={`p-4 rounded-xl bg-secondary/50 border-2 relative ${
                profile?.stripe_account_id ? "border-success/50" : "border-border"
              }`}>
                {profile?.stripe_account_id && (
                  <div className="absolute -top-2 -right-2">
                    <div className="p-1 rounded-full bg-success">
                      <CheckCircle2 className="w-4 h-4 text-success-foreground" />
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Stripe Connect</p>
                    <p className="text-xs text-muted-foreground">Método principal de recebimento</p>
                  </div>
                </div>
                {profile?.stripe_account_id ? (
                  <div className="flex items-center gap-2 text-success text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Conta conectada
                  </div>
                ) : (
                  <Button className="w-full mt-2" variant="outline">
                    Conectar Stripe
                  </Button>
                )}
              </div>

              {/* PIX/TED - Coming Soon */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-dashed border-border relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px]">
                    Em Breve
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">PIX / TED</p>
                    <p className="text-xs text-muted-foreground">Receba via banco</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Transferência direta para sua conta bancária
                </p>
              </div>

              {/* Connected Account Info */}
              {profile?.stripe_account_id && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Conta Stripe Conectada</Label>
                    <Input
                      value={profile.stripe_account_id}
                      disabled
                      className="bg-secondary border-border text-muted-foreground font-mono text-sm"
                    />
                  </div>
                  <Button variant="outline" className="w-full border-border">
                    Gerenciar Conta Stripe
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Finances;
