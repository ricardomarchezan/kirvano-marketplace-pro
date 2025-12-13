import { Bell, Search, Moon, Sun, TrendingUp, ShoppingCart, LogOut, User, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ThemeProvider";
import { Progress } from "@/components/ui/progress";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useNotification } from "@/contexts/NotificationContext";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { itemCount, total } = useCart();
  const { user, profile, logout } = useAuth();
  const { metrics } = useData();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const navigate = useNavigate();
  
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Use real user sales progress
  const currentSales = metrics.totalRevenue;
  const maxSales = 10000;
  const progressPercent = Math.min((currentSales / maxSales) * 100, 100);

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
                {itemCount > 0 ? `${itemCount} ${itemCount === 1 ? "item" : "itens"} - R$ ${total.toFixed(2)}` : "Carrinho vazio"}
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative p-2 rounded-lg hover:bg-secondary active:bg-secondary/80 transition-all active:scale-95">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full">
                    <span className="absolute inset-0 bg-primary rounded-full animate-ping" />
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-card border-border" align="end">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-foreground">Notificações</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-muted-foreground">{unreadCount} não lida{unreadCount > 1 ? 's' : ''}</p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">
                    Marcar todas como lidas
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-4 border-b border-border cursor-pointer hover:bg-secondary/50 transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {!notification.read && <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

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
                  <Progress value={progressPercent} className="h-1.5 w-24 bg-secondary" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-card border-border">
                <div className="text-center">
                  <p className="font-medium text-foreground">Progresso de Vendas</p>
                  <p className="text-xs text-muted-foreground">R$ {(maxSales - currentSales).toLocaleString("pt-BR")} para a meta</p>
                </div>
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative focus:outline-none">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                    <span className="text-primary-foreground font-semibold text-sm">{getInitials()}</span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.name || 'Usuário'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/perfil"><User className="mr-2 h-4 w-4" />Meu Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/configuracoes"><Settings className="mr-2 h-4 w-4" />Configurações</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
