import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { Download, FileBarChart, TrendingUp, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import { useAnalyticsStore } from "@/store/analytics";
import { useOrderStore } from "@/store/orders";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — H&M Trads Admin" },
      { name: "description", content: "Sales, profit and inventory analytics with downloadable reports." },
    ],
  }),
  component: ReportsPage,
});

const COLORS = ["oklch(0.72 0.18 265)", "oklch(0.78 0.18 200)", "oklch(0.78 0.18 320)", "oklch(0.8 0.17 75)"];

function ReportsPage() {
  const { fetchAnalytics, getMetrics } = useAnalyticsStore();
  const orders = useOrderStore((s) => s.orders);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const metrics = getMetrics();

  const monthlyRevenue = useMemo(() => {
    const grouped = new Map<string, { month: string; revenue: number; cost: number; profit: number }>();
    metrics.dailyMetrics.forEach((d) => {
      const dt = new Date(d.date);
      const month = dt.toLocaleString("en-US", { month: "short" });
      const existing = grouped.get(month) ?? { month, revenue: 0, cost: 0, profit: 0 };
      existing.revenue += d.totalRevenue;
      existing.profit += d.totalProfit;
      existing.cost += Math.max(0, d.totalRevenue - d.totalProfit);
      grouped.set(month, existing);
    });
    return Array.from(grouped.values());
  }, [metrics.dailyMetrics]);

  const topBrands = useMemo(
    () => metrics.brandDistribution
      .sort((a, b) => b.count - a.count)
      .slice(0, 7)
      .map((b) => ({ brand: b.brand, sales: b.count })),
    [metrics.brandDistribution],
  );

  const b2bVsB2c = useMemo(
    () => [
      { name: "B2B", value: metrics.b2bVsB2c.b2b.revenue },
      { name: "B2C", value: metrics.b2bVsB2c.b2c.revenue },
    ],
    [metrics.b2bVsB2c],
  );

  const channels = useMemo(() => {
    const counts = orders.reduce<Record<string, number>>((acc, order) => {
      const key = order.paymentMethod || "Unknown";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([channel, value]) => ({ channel, value }));
  }, [orders]);

  const profit = monthlyRevenue.map((m) => ({ ...m, profit: m.revenue - m.cost }));

  const exportCsv = () => {
    const header = "Month,Revenue,Cost,Profit";
    const rows = monthlyRevenue.map((m) => `${m.month},${m.revenue},${m.cost},${m.profit}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hm-trads-reports-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Live report exported");
  };

  return (
    <AppShell>
      <Topbar title="Reports" subtitle="Performance analytics and financial summaries" action={
        <button onClick={exportCsv} className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium shadow-glow">
          <Download className="h-4 w-4" /> Export PDF
        </button>
      } />
      <div className="p-4 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card delay={0} className="xl:col-span-2" title="Revenue & Profit" subtitle="Last 12 months" icon={TrendingUp}>
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={profit}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                  <XAxis dataKey="month" stroke="oklch(0.7 0.03 260)" fontSize={12} />
                  <YAxis stroke="oklch(0.7 0.03 260)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.025 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="oklch(0.72 0.18 265)" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="cost" stroke="oklch(0.78 0.18 200)" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="profit" stroke="oklch(0.8 0.17 155)" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card delay={0.1} title="Sales by Channel" subtitle="Distribution this quarter" icon={FileBarChart}>
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={channels} dataKey="value" nameKey="channel" innerRadius={60} outerRadius={100} paddingAngle={4}>
                    {channels.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.025 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card delay={0.15} title="Top Brands" subtitle="Units sold" icon={DollarSign}>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={topBrands} layout="vertical" margin={{ left: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                  <XAxis type="number" stroke="oklch(0.7 0.03 260)" fontSize={12} />
                  <YAxis dataKey="brand" type="category" stroke="oklch(0.7 0.03 260)" fontSize={12} width={70} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.025 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                  <Bar dataKey="sales" fill="oklch(0.78 0.18 320)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card delay={0.2} title="Cumulative Revenue" subtitle="YTD" icon={TrendingUp} className="xl:col-span-2">
            <div className="h-72">
              <ResponsiveContainer>
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="cum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.18 265)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.72 0.18 265)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                  <XAxis dataKey="month" stroke="oklch(0.7 0.03 260)" fontSize={12} />
                  <YAxis stroke="oklch(0.7 0.03 260)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.025 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="oklch(0.72 0.18 265)" strokeWidth={2.5} fill="url(#cum)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card delay={0.25} title="B2B vs B2C" subtitle="Revenue split" icon={DollarSign}>
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={b2bVsB2c} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={4}>
                    {b2bVsB2c.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.025 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Card({ title, subtitle, icon: Icon, children, delay = 0, className = "" }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className={`glass rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-display font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      {children}
    </motion.div>
  );
}
