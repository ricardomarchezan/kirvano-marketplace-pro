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
} from "lucide-react";

type TransactionType = "credit" | "debit" | "refund";
type TransactionStatus = "completed" | "pending" | "refunded";

interface Transaction {
  id: number;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  status: TransactionStatus;
}

const transactions: Transaction[] = [
  {
    id: 1,
    type: "credit",
    description: "Comissão - CloudCRM Pro",
    amount: 59.1,
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: 2,
    type: "credit",
    description: "Comissão - AutoEmail AI",
    amount: 38.8,
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: 3,
    type: "debit",
    description: "Saque - Conta Principal",
    amount: 500.0,
    date: "2024-01-13",
    status: "completed",
  },
  {
    id: 4,
    type: "credit",
    description: "Comissão - DataAnalytics",
    amount: 74.25,
    date: "2024-01-12",
    status: "pending",
  },
  {
    id: 5,
    type: "refund",
    description: "Reembolso - TaskFlow Pro",
    amount: 16.45,
    date: "2024-01-11",
    status: "refunded",
  },
  {
    id: 6,
    type: "credit",
    description: "Comissão - InvoiceMaster",
    amount: 30.15,
    date: "2024-01-10",
    status: "completed",
  },
  {
    id: 7,
    type: "debit",
    description: "Saque - PIX",
    amount: 1000.0,
    date: "2024-01-08",
    status: "completed",
  },
  {
    id: 8,
    type: "refund",
    description: "Chargeback - Cliente #4521",
    amount: 197.0,
    date: "2024-01-07",
    status: "refunded",
  },
];

const getTransactionStyles = (type: TransactionType, status: TransactionStatus) => {
  if (status === "refunded" || type === "refund") {
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
    case "refunded":
      return (
        <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">
          <XCircle className="w-3 h-3 mr-1" />
          Reembolsado
        </Badge>
      );
  }
};

const Finances = () => {
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

        {/* Balance Cards - Enhanced */}
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
                  <p className="text-3xl font-bold text-foreground">R$ 32.450,00</p>
                </div>
              </div>
              <Button className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold">
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
                  <p className="text-3xl font-bold text-foreground">R$ 13.440,00</p>
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
                  <p className="text-3xl font-bold text-foreground">R$ 89.230,00</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Desde o início da conta</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transactions - Enhanced */}
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
            <div className="space-y-3">
              {transactions.map((transaction) => {
                const styles = getTransactionStyles(transaction.type, transaction.status);
                const Icon = styles.icon;
                
                return (
                  <div
                    key={transaction.id}
                    className={`flex items-center justify-between p-4 rounded-xl hover:bg-secondary/80 transition-colors ${
                      transaction.status === "refunded" ? "opacity-70" : ""
                    }`}
                    style={{ backgroundColor: `hsl(var(--secondary) / 0.5)` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${styles.bg}`}>
                        <Icon className={`w-5 h-5 ${styles.iconColor}`} />
                      </div>
                      <div>
                        <p className={`font-medium ${
                          transaction.status === "refunded" ? "text-muted-foreground line-through" : "text-foreground"
                        }`}>
                          {transaction.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString("pt-BR", {
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
                          {styles.prefix} R$ {transaction.amount.toFixed(2)}
                        </p>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Configuration - Enhanced */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Configurar Recebimento
            </h2>
            <div className="space-y-4">
              {/* Stripe Connect - Active */}
              <div className="p-4 rounded-xl bg-secondary/50 border-2 border-success/50 relative">
                <div className="absolute -top-2 -right-2">
                  <div className="p-1 rounded-full bg-success">
                    <CheckCircle2 className="w-4 h-4 text-success-foreground" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Stripe Connect</p>
                    <p className="text-xs text-muted-foreground">Método principal de recebimento</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-success text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Conta conectada
                </div>
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
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Conta Stripe Conectada</Label>
                  <Input
                    value="acct_1234567890"
                    disabled
                    className="bg-secondary border-border text-muted-foreground font-mono text-sm"
                  />
                </div>
                <Button variant="outline" className="w-full border-border">
                  Gerenciar Conta Stripe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Finances;
