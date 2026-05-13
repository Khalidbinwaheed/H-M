import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  accent?: "primary" | "accent" | "success" | "warning";
  delay?: number;
}

const accents: Record<string, string> = {
  primary: "from-primary/30 to-primary/0",
  accent: "from-accent/30 to-accent/0",
  success: "from-success/30 to-success/0",
  warning: "from-warning/30 to-warning/0",
};

export function StatCard({ title, value, icon: Icon, trend, trendUp, accent = "primary", delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-2xl p-5 relative overflow-hidden group"
    >
      <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${accents[accent]} blur-2xl opacity-80 group-hover:opacity-100 transition`} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
          <div className="mt-2 text-3xl font-display font-bold tracking-tight">{value}</div>
          {trend && (
            <div className={`mt-2 text-xs font-medium ${trendUp ? "text-success" : "text-destructive"}`}>
              {trendUp ? "▲" : "▼"} {trend}
            </div>
          )}
        </div>
        <div className="w-11 h-11 rounded-xl glass-strong grid place-items-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </motion.div>
  );
}
