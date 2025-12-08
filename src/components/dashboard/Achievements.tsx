import { Trophy, Target, Zap, Crown, Star, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const achievements = [
  {
    icon: Trophy,
    title: "Primeira Venda",
    description: "Realize sua primeira venda",
    progress: 100,
    unlocked: true,
  },
  {
    icon: Target,
    title: "10K Faturamento",
    description: "Alcance R$ 10.000 em vendas",
    progress: 100,
    unlocked: true,
  },
  {
    icon: Zap,
    title: "Velocista",
    description: "10 vendas em um dia",
    progress: 70,
    unlocked: false,
  },
  {
    icon: Crown,
    title: "Nível Expert",
    description: "R$ 50.000 em comissões",
    progress: 45,
    unlocked: false,
  },
  {
    icon: Star,
    title: "Top Afiliado",
    description: "Entre no top 10 do mês",
    progress: 30,
    unlocked: false,
  },
  {
    icon: Rocket,
    title: "Lançamento",
    description: "Promova 5 SaaS diferentes",
    progress: 60,
    unlocked: false,
  },
];

export function Achievements() {
  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Jornada de Conquistas</h2>
          <p className="text-sm text-muted-foreground">Continue evoluindo!</p>
        </div>
        <span className="text-sm text-primary font-medium">2/6 desbloqueadas</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.title}
            className={cn(
              "relative p-4 rounded-xl border transition-all duration-300",
              achievement.unlocked
                ? "bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 glow-primary"
                : "bg-secondary/50 border-border hover:border-border/80"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                achievement.unlocked ? "bg-primary/20" : "bg-muted"
              )}
            >
              <achievement.icon
                className={cn(
                  "w-5 h-5",
                  achievement.unlocked ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
            <h3
              className={cn(
                "font-semibold text-sm mb-1",
                achievement.unlocked ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {achievement.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">{achievement.description}</p>
            
            {!achievement.unlocked && (
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${achievement.progress}%` }}
                />
              </div>
            )}
            
            {achievement.unlocked && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-success-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
