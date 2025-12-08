import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  Store,
  Package,
  Wallet,
  Puzzle,
  HelpCircle,
  Gift,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: TrendingUp, label: "Vendas", path: "/vendas" },
  { icon: Store, label: "Marketplace", path: "/marketplace" },
  { icon: Package, label: "SaaS", path: "/saas" },
  { icon: Wallet, label: "Finanças", path: "/financas" },
  { icon: Puzzle, label: "Integrações", path: "/integracoes" },
  { icon: HelpCircle, label: "Ajuda e Suporte", path: "/ajuda" },
  { icon: Gift, label: "Indique e Ganhe", path: "/indicacao" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 shadow-xl",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[hsl(250,91%,65%)] flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-foreground text-lg">MarketSaaS</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    isActive ? "text-primary" : "group-hover:text-primary"
                  )}
                />
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[hsl(250,91%,65%)] flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">JD</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">João Silva</p>
                <p className="text-xs text-muted-foreground truncate">joao@empresa.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
