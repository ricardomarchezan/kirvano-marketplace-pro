import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Gift, Users, DollarSign, Share2, Trophy, Star, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";

// Referral metrics interface
interface ReferralMetrics {
  totalReferrals: number;
  totalEarnings: number;
  monthlyEarnings: number;
  ranking: number | null;
}

// Referral interface
interface Referral {
  id: string;
  name: string;
  email: string;
  status: "pending" | "active";
  earned: number;
  created_at: string;
}

const Referral = () => {
  const { user } = useAuth();
  const { loading } = useData();

  // For now, referrals are empty - will be populated as users invite others
  const referrals: Referral[] = [];

  // Calculate metrics from referrals
  const referralMetrics: ReferralMetrics = {
    totalReferrals: referrals.length,
    totalEarnings: referrals.reduce((sum, r) => sum + r.earned, 0),
    monthlyEarnings: referrals
      .filter((r) => {
        const date = new Date(r.created_at);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, r) => sum + r.earned, 0),
    ranking: referrals.length > 0 ? null : null,
  };

  // Generate referral link with real user ID
  const referralLink = user ? `https://marketsaas.com/r/${user.id}` : "";

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link copiado!",
      description: "Seu link de indicação foi copiado.",
    });
  };

  const handleShare = async () => {
    if (!referralLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Convite MarketSaaS",
          text: "Junte-se ao MarketSaaS e ganhe comissões!",
          url: referralLink,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopy();
    }
  };

  const getTierInfo = () => {
    const total = referralMetrics.totalReferrals;
    if (total >= 51) return { name: "Ouro", commission: 30 };
    if (total >= 11) return { name: "Prata", commission: 25 };
    return { name: "Bronze", commission: 20 };
  };

  const currentTier = getTierInfo();

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
                  Ganhe {currentTier.commission}% de comissão vitalícia
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
                placeholder="Faça login para gerar seu link"
              />
              <Button onClick={handleCopy} className="bg-primary hover:bg-primary/90" disabled={!referralLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link
              </Button>
              <Button variant="outline" className="border-border" onClick={handleShare} disabled={!referralLink}>
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
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{referralMetrics.totalReferrals}</p>
                )}
              </div>
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min((referralMetrics.totalReferrals / 10) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.max(0, 10 - referralMetrics.totalReferrals)} para próximo nível
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-success/10">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ganhos Totais</p>
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">
                    R$ {referralMetrics.totalEarnings.toFixed(2).replace(".", ",")}
                  </p>
                )}
              </div>
            </div>
            {referralMetrics.monthlyEarnings > 0 ? (
              <p className="text-xs text-success">
                +R$ {referralMetrics.monthlyEarnings.toFixed(2).replace(".", ",")} este mês
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Nenhum ganho ainda</p>
            )}
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <Trophy className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ranking</p>
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">
                    {referralMetrics.ranking ? `#${referralMetrics.ranking}` : "-"}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {referralMetrics.ranking ? "Entre os top afiliados" : "Faça sua primeira indicação"}
            </p>
          </div>
        </div>

        {/* Referrals List */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Suas Indicações</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-foreground mb-2">Nenhuma indicação ainda</p>
              <p className="text-sm text-muted-foreground mb-6">
                Compartilhe seu link e ganhe {currentTier.commission}% de comissão vitalícia
              </p>
              <Button onClick={handleCopy} className="bg-primary" disabled={!referralLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link de Indicação
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
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
          )}
        </div>

        {/* Tiers */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Níveis de Parceria</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border ${
              currentTier.name === "Bronze" ? "border-primary/50 bg-primary/5" : "border-border bg-secondary/30"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Star className={`w-5 h-5 ${currentTier.name === "Bronze" ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`font-semibold ${currentTier.name === "Bronze" ? "text-primary" : "text-foreground"}`}>Bronze</span>
                {currentTier.name === "Bronze" && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    Atual
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">20%</p>
              <p className="text-sm text-muted-foreground">0-10 indicações</p>
            </div>
            <div className={`p-4 rounded-xl border ${
              currentTier.name === "Prata" ? "border-primary/50 bg-primary/5" : "border-border bg-secondary/30"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Star className={`w-5 h-5 ${currentTier.name === "Prata" ? "text-primary fill-current" : "text-muted-foreground"}`} />
                <span className={`font-semibold ${currentTier.name === "Prata" ? "text-primary" : "text-foreground"}`}>Prata</span>
                {currentTier.name === "Prata" && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    Atual
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">25%</p>
              <p className="text-sm text-muted-foreground">11-50 indicações</p>
            </div>
            <div className={`p-4 rounded-xl border ${
              currentTier.name === "Ouro" ? "border-warning/50 bg-warning/5" : "border-border bg-secondary/30"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Star className={`w-5 h-5 ${currentTier.name === "Ouro" ? "text-warning fill-current" : "text-muted-foreground"}`} />
                <span className={`font-semibold ${currentTier.name === "Ouro" ? "text-warning" : "text-foreground"}`}>Ouro</span>
                {currentTier.name === "Ouro" && (
                  <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full">
                    Atual
                  </span>
                )}
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
