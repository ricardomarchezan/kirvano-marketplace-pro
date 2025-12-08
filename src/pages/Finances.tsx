import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CreditCard,
  Building2,
  CheckCircle2,
} from "lucide-react";

const transactions = [
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
];

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

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-success/10">
                <Wallet className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo Disponível</p>
                <p className="text-2xl font-bold text-foreground">R$ 32.450,00</p>
              </div>
            </div>
            <Button className="w-full bg-success hover:bg-success/90 text-success-foreground">
              Solicitar Saque
            </Button>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo Pendente</p>
                <p className="text-2xl font-bold text-foreground">R$ 13.440,00</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Liberado em até 14 dias após a compra
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <ArrowUpRight className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sacado</p>
                <p className="text-2xl font-bold text-foreground">R$ 89.230,00</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Desde o início da conta</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transactions */}
          <div className="lg:col-span-2 glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Extrato</h2>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.type === "credit"
                          ? "bg-success/10"
                          : "bg-destructive/10"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowUpRight className="w-5 h-5 text-success" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === "credit"
                          ? "text-success"
                          : "text-destructive"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"} R${" "}
                      {transaction.amount.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        transaction.status === "completed"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {transaction.status === "completed" ? "Concluído" : "Pendente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stripe Connect */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Configurar Recebimento
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Stripe Connect</p>
                    <p className="text-xs text-muted-foreground">Receba via Stripe</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-success text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Conectado
                </div>
              </div>

              <div className="p-4 rounded-xl bg-secondary/50 border border-border border-dashed">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">PIX/TED</p>
                    <p className="text-xs text-muted-foreground">Em breve</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Conta Stripe Conectada</Label>
                  <Input
                    value="acct_1234567890"
                    disabled
                    className="bg-secondary border-border text-muted-foreground"
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
