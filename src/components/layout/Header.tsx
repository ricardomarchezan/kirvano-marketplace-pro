import { Bell, Search, Moon, Sun, TrendingUp, ShoppingCart, LogOut, User, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ThemeProvider";
import { Progress } from "@/components/ui/progress";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { itemCount, total } = useCart();
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Simulated user progress (0-10K)
  const currentSales = 7450;
  const maxSales = 10000;
  const progressPercent = (currentSales / maxSales) * 100;

  // Get user initials
  const getInitials = () => {
    if (profile?.name) {
      const names = profile.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return profile.name.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary active:bg-secondary/80 transition-all active:scale-95"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-muted-foreground hover:text-warning transition-colors" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            )}
          </button>

          {/* Shopping Cart */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate("/checkout")}
                className="relative p-2 rounded-lg hover:bg-secondary active:bg-secondary/80 transition-all active:scale-95"
              >
                <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-card border-border">
              <p className="text-sm">
                {itemCount > 0
                  ? `${itemCount} ${itemCount === 1 ? "item" : "itens"} - R$ ${total.toFixed(2)}`
                  : "Carrinho vazio"}
              </p>
            </TooltipContent>
          </Tooltip>

          <button className="relative p-2 rounded-lg hover:bg-secondary active:bg-secondary/80 transition-all active:scale-95">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* Progress Bar with Avatar */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="hidden md:flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-success" />
                    <span className="text-xs font-semibold text-foreground">
                      R$ {currentSales.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 10K</span>
                  </div>
                  <Progress 
                    value={progressPercent} 
                    className="h-1.5 w-24 bg-secondary"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-card border-border">
                <div className="text-center">
                  <p className="font-medium text-foreground">Nível 5 - Expert</p>
                  <p className="text-xs text-muted-foreground">
                    R$ {(maxSales - currentSales).toLocaleString("pt-BR")} para o próximo nível
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>

            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative focus:outline-none">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[hsl(250,91%,65%)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                    <span className="text-primary-foreground font-semibold text-sm">
                      {getInitials()}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-success border-2 border-background flex items-center justify-center">
                    <span className="text-[8px] font-bold text-success-foreground">5</span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.name || 'Usuário'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
