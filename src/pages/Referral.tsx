import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Gift, Users, DollarSign, Share2, Trophy, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const referrals = [
  { name: "Carlos Silva", email: "carlos@email.com", status: "active", earned: 150 },
  { name: "Ana Paula", email: "ana@email.com", status: "pending", earned: 0 },
  { name: "Roberto Lima", email: "roberto@email.com", status: "active", earned: 300 },
];

const Referral = () => {
  const { user } = useAuth();
  
  // Generate referral link with real user ID
  const referralLink = user 
    ? `https://marketsaas.com/r/${user.id}`
    : '';

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link copiado!",
      description: "Seu link de indicação foi copiado.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Indique e Ganhe</h1>
          <p className="text-muted-foreground mt-1">
            Convide amigos e ganhe comissões recorrentes
          </p>
        </div>

        {/* Hero Card */}
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Gift className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Ganhe 20% de comissão vitalícia
                </h2>
                <p className="text-muted-foreground">
                  Para cada pessoa que assinar através do seu link
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <Input
                value={referralLink}
                readOnly
                className="bg-secondary border-border flex-1"
              />
              <Button onClick={handleCopy} className="bg-primary hover:bg-primary/90">
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link
              </Button>
              <Button variant="outline" className="border-border">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Indicados</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-primary rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">3 de 10 para próximo nível</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-success/10">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ganhos Totais</p>
                <p className="text-2xl font-bold text-foreground">R$ 2.340,00</p>
              </div>
            </div>
            <p className="text-xs text-success">+R$ 450 este mês</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <Trophy className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ranking</p>
                <p className="text-2xl font-bold text-foreground">#23</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Entre os top afiliados</p>
          </div>
        </div>

        {/* Referrals List */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Suas Indicações</h2>
          <div className="space-y-3">
            {referrals.map((referral) => (
              <div
                key={referral.email}
                className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[hsl(250,91%,65%)] flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold text-sm">
                      {referral.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{referral.name}</p>
                    <p className="text-sm text-muted-foreground">{referral.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      referral.status === "active"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {referral.status === "active" ? "Ativo" : "Pendente"}
                  </span>
                  {referral.earned > 0 && (
                    <span className="text-success font-semibold">
                      +R$ {referral.earned.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tiers */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Níveis de Parceria</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-secondary/30">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold text-foreground">Bronze</span>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">20%</p>
              <p className="text-sm text-muted-foreground">1-10 indicações</p>
            </div>
            <div className="p-4 rounded-xl border border-primary/50 bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-primary fill-current" />
                <span className="font-semibold text-primary">Prata</span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  Atual
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">25%</p>
              <p className="text-sm text-muted-foreground">11-50 indicações</p>
            </div>
            <div className="p-4 rounded-xl border border-warning/50 bg-warning/5">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-warning fill-current" />
                <span className="font-semibold text-warning">Ouro</span>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">30%</p>
              <p className="text-sm text-muted-foreground">51+ indicações</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Referral;
