import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-6">
          <p className="text-sm text-muted-foreground capitalize">{today}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-10 w-64 bg-secondary border-border focus:border-primary"
            />
          </div>

          <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </button>

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[hsl(250,91%,65%)] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
            <span className="text-primary-foreground font-semibold text-sm">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
