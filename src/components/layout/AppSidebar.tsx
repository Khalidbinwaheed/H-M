import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Laptop as LaptopIcon, Plug, Users, ArrowDownToLine, ArrowUpFromLine, BarChart3, Settings, Bell, Boxes, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Laptops", url: "/laptops", icon: LaptopIcon },
  { title: "Chargers", url: "/chargers", icon: Plug },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Inventory", url: "/inventory", icon: Boxes },
  { title: "Imports", url: "/imports", icon: ArrowDownToLine },
  { title: "Exports", url: "/exports", icon: ArrowUpFromLine },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => url === "/" ? path === "/" : path.startsWith(url);
  const { user } = useAuthStore();
  
  const userName = user?.name || "Admin";
  const userRole = user?.role || "Administrator";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 glass-strong border-r border-sidebar-border">
      <div className="px-6 py-6 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
          <span className="font-display font-bold text-primary-foreground">H</span>
        </div>
        <div>
          <div className="font-display font-bold text-lg leading-none">H&M Trads</div>
          <div className="text-xs text-muted-foreground mt-1">Admin Console</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {items.map((item) => {
          const active = isActive(item.url);
          return (
            <Link
              key={item.url}
              to={item.url}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {active && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-lg bg-gradient-primary opacity-90 shadow-glow"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <item.icon className={`h-4 w-4 relative z-10 ${active ? "text-primary-foreground" : ""}`} />
              <span className={`relative z-10 ${active ? "text-primary-foreground font-medium" : ""}`}>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="glass rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-accent grid place-items-center text-sm font-semibold text-primary-foreground">{initial}</div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{userName}</div>
            <div className="text-xs text-muted-foreground capitalize">{userRole.toLowerCase()}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
