import { Search, Bell, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Topbar({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/40 border-b border-border">
      <div className="flex items-center gap-4 px-4 lg:px-8 py-4">
        <div className="min-w-0">
          <h1 className="text-xl lg:text-2xl font-display font-semibold tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex-1 hidden md:flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search laptops, customers, orders…"
              className="w-full glass rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/60"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {action ?? (
            <Link to="/laptops/new" className="hidden sm:inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium shadow-glow hover:opacity-90 transition">
              <Plus className="h-4 w-4" /> Add Laptop
            </Link>
          )}
          <button className="relative w-10 h-10 rounded-xl glass grid place-items-center hover:bg-accent/10 transition">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
