import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Laptop, Plug, Users, ShoppingCart, ArrowDownToLine, ArrowUpFromLine,
  AlertTriangle, DollarSign, TrendingUp, Clock, Package, Download, Upload, FileText
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { useLaptopStore } from "@/store/laptops";
import { useChargerStore } from "@/store/chargers";
import { useCustomerStore } from "@/store/customers";
import { useOrderStore } from "@/store/orders";
import { useAnalyticsStore } from "@/store/analytics";
import { useEffect, useState, useMemo } from "react";
import { fetchInventoryImports, fetchInventoryExports, subscribeTable } from "@/lib/supabase/realtime-data";
import { InvoiceModal } from "@/components/orders/InvoiceModal";
import { Order } from "@/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — H&M Trads Admin" },
      { name: "description", content: "Live overview of laptop & charger inventory, sales, imports, exports and customer analytics for H&M Trads." },
      { property: "og:title", content: "H&M Trads Admin Dashboard" },
      { property: "og:description", content: "Enterprise admin console for H&M Trads laptop and accessories business." },
    ],
  }),
  component: Dashboard,
});

const COLORS = ["oklch(0.72 0.18 265)", "oklch(0.78 0.18 200)", "oklch(0.78 0.18 320)", "oklch(0.8 0.17 75)", "oklch(0.72 0.17 155)"];

function Dashboard() {
  const laptops = useLaptopStore((s) => s.laptops);
  const chargers = useChargerStore((s) => s.chargers);
  const customers = useCustomerStore((s) => s.customers);
  const orders = useOrderStore((s) => s.orders);
  const { fetchAnalytics, getMetrics } = useAnalyticsStore();
  const [imports, setImports] = useState<any[]>([]);
  const [exportsData, setExportsData] = useState<any[]>([]);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchAnalytics();

    const loadExtra = async () => {
      const [imp, exp] = await Promise.all([
        fetchInventoryImports(),
        fetchInventoryExports(),
      ]);
      setImports(imp);
      setExportsData(exp);
    };
    loadExtra();

    const unsubImports = subscribeTable("inventory_imports", loadExtra);
    const unsubExports = subscribeTable("inventory_exports", loadExtra);

    return () => {
      unsubImports();
      unsubExports();
    };
  }, [fetchAnalytics]);

  const metrics = getMetrics();
  const totalLaptopQty = laptops.reduce((a, l) => a + (Number(l.currentQuantity) || 0), 0);
  const totalChargerQty = chargers.reduce((a, c) => a + (Number(c.quantity) || 0), 0);
  const b2bCustomers = customers.filter((c) => c.type === "B2B").length;
  const b2cCustomers = customers.filter((c) => c.type === "B2C").length;
  const lowStockCount = laptops.filter((l) => l.currentQuantity <= l.reorderLevel).length;
  const totalRevenue = metrics.totalRevenue;
  const totalProfit = metrics.totalProfit;

  const recentOrders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
  const recentCustomers = customers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const chartMonthlyRevenue = useMemo(() => {
    const grouped = new Map<string, { month: string; revenue: number; cost: number }>();
    metrics.dailyMetrics.forEach((d) => {
      const dt = new Date(d.date);
      const month = dt.toLocaleString("en-US", { month: "short" });
      const existing = grouped.get(month) ?? { month, revenue: 0, cost: 0 };
      existing.revenue += d.totalRevenue;
      existing.cost += Math.max(0, d.totalRevenue - d.totalProfit);
      grouped.set(month, existing);
    });
    return Array.from(grouped.values());
  }, [metrics.dailyMetrics]);

  const chartTopBrands = useMemo(() => {
    return metrics.brandDistribution
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(b => ({ brand: b.brand, sales: b.count }));
  }, [metrics.brandDistribution]);

  const chartB2bVsB2c = useMemo(() => [
    { name: "B2B", value: metrics.b2bVsB2c.b2b.revenue },
    { name: "B2C", value: metrics.b2bVsB2c.b2c.revenue }
  ], [metrics.b2bVsB2c]);

  const chartImportExport = useMemo(() => {
    const grouped = new Map<string, { day: string; imports: number; exports: number }>();
    
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const day = d.toLocaleString("en-US", { weekday: "short" });
      grouped.set(day, { day, imports: 0, exports: 0 });
    }

    imports.forEach(imp => {
      const dt = new Date(imp.date);
      if (Date.now() - dt.getTime() <= 7 * 86400000) {
        const day = dt.toLocaleString("en-US", { weekday: "short" });
        if (grouped.has(day)) {
          grouped.get(day)!.imports += Number(imp.total_cost || 0);
        }
      }
    });

    exportsData.forEach(exp => {
      const dt = new Date(exp.date);
      if (Date.now() - dt.getTime() <= 7 * 86400000) {
        const day = dt.toLocaleString("en-US", { weekday: "short" });
        if (grouped.has(day)) {
          grouped.get(day)!.exports += Number(exp.total_revenue || 0);
        }
      }
    });

    return Array.from(grouped.values());
  }, [imports, exportsData]);

  return (
    <AppShell>
      <Topbar title="Dashboard" subtitle="Welcome back! Here's your business overview for today" />

      <div className="p-4 lg:p-8 space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard 
            title="Total Laptops" 
            value={totalLaptopQty} 
            icon={Laptop} 
            trend={`${laptops.filter(l => l.isActive).length} active models`}
            accent="primary" 
            delay={0.0} 
          />
          <StatCard 
            title="Total Chargers" 
            value={totalChargerQty} 
            icon={Plug} 
            trend={`${chargers.filter(c => c.isActive).length} active models`}
            accent="accent" 
            delay={0.05} 
          />
          <StatCard 
            title="Total Customers" 
            value={customers.length} 
            icon={Users} 
            trend={`${b2bCustomers} B2B, ${b2cCustomers} B2C`}
            accent="success" 
            delay={0.1} 
          />
          <StatCard 
            title="Total Revenue" 
            value={formatCurrency(totalRevenue)} 
            icon={DollarSign} 
            trend={`${formatCurrency(totalProfit)} profit`}
            accent="primary" 
            delay={0.15} 
          />
          <StatCard 
            title="Low Stock" 
            value={lowStockCount} 
            icon={AlertTriangle} 
            trend="Needs review"
            accent="warning" 
            delay={0.2} 
          />
          <StatCard 
            title="Pending Orders" 
            value={orders.filter((o) => o.status === "Pending").length} 
            icon={Package} 
            trend={`${orders.filter((o) => o.paymentStatus === "Unpaid").length} unpaid`}
            accent="info" 
            delay={0.25} 
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }} 
            className="xl:col-span-2 glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-display font-semibold">Monthly Revenue</h2>
                <p className="text-xs text-muted-foreground">Revenue vs Cost — last 12 months</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-success font-medium">+18.4%</span>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer>
                <AreaChart data={chartMonthlyRevenue}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.18 265)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="oklch(0.72 0.18 265)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.78 0.18 200)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="oklch(0.78 0.18 200)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                  <XAxis dataKey="month" stroke="oklch(0.7 0.03 260)" fontSize={12} />
                  <YAxis stroke="oklch(0.7 0.03 260)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.025 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="oklch(0.72 0.18 265)" strokeWidth={2} fill="url(#rev)" />
                  <Area type="monotone" dataKey="cost" stroke="oklch(0.78 0.18 200)" strokeWidth={2} fill="url(#cost)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.35 }} 
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-lg font-display font-semibold">B2B vs B2C</h2>
            <p className="text-xs text-muted-foreground mb-4">Sales distribution</p>
            <div className="h-56">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={chartB2bVsB2c} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={4}>
                    {chartB2bVsB2c.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.025 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="glass rounded-xl p-3">
                <div className="text-xs text-muted-foreground">B2B</div>
                <div className="text-sm font-semibold">{b2bCustomers}</div>
              </div>
              <div className="glass rounded-xl p-3">
                <div className="text-xs text-muted-foreground">B2C</div>
                <div className="text-sm font-semibold">{b2cCustomers}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }} 
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-lg font-display font-semibold">Imports vs Exports</h2>
            <p className="text-xs text-muted-foreground mb-4">Daily activity this week</p>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={chartImportExport}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                  <XAxis dataKey="day" stroke="oklch(0.7 0.03 260)" fontSize={12} />
                  <YAxis stroke="oklch(0.7 0.03 260)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.025 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                  <Bar dataKey="imports" fill="oklch(0.72 0.18 265)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="exports" fill="oklch(0.78 0.18 200)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.45 }} 
            className="xl:col-span-2 glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-display font-semibold">Top Selling Brands</h2>
                <p className="text-xs text-muted-foreground">Units sold this month</p>
              </div>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={chartTopBrands} layout="vertical" margin={{ left: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                  <XAxis type="number" stroke="oklch(0.7 0.03 260)" fontSize={12} />
                  <YAxis dataKey="brand" type="category" stroke="oklch(0.7 0.03 260)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.025 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                  <Bar dataKey="sales" fill="oklch(0.78 0.18 320)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Recent Data Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }} 
            className="xl:col-span-2 glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold">Recent Orders</h2>
              <ArrowUpFromLine className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="py-3 pr-3">Order ID</th>
                    <th className="py-3 pr-3">Customer</th>
                    <th className="py-3 pr-3">Amount</th>
                    <th className="py-3 pr-3">Status</th>
                    <th className="py-3 pr-3">Payment</th>
                    <th className="py-3 pl-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-accent/5 transition">
                      <td className="py-3 pr-3 font-mono text-xs">{order.orderNumber}</td>
                      <td className="py-3 pr-3">
                        {customers.find((c) => c.id === order.customerId)?.name || "N/A"}
                      </td>
                      <td className="py-3 pr-3 font-medium">{formatCurrency(order.total)}</td>
                      <td className="py-3 pr-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-3 pr-3">
                        <PaymentBadge status={order.paymentStatus} />
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <button 
                          onClick={() => setInvoiceOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg text-xs font-medium transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.55 }} 
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-lg font-display font-semibold mb-4">Recent Customers</h2>
            <ul className="space-y-3">
              {recentCustomers.map((customer) => (
                <li key={customer.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/5 transition">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 grid place-items-center text-xs font-semibold text-primary-foreground">
                    {customer.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{customer.name}</div>
                    <div className="text-xs text-muted-foreground">{customer.type}</div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {invoiceOrder && (
        <InvoiceModal
          order={invoiceOrder}
          customer={customers.find(c => c.id === invoiceOrder.customerId)}
          laptops={laptops}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </AppShell>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Pending: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
    Processing: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    Shipped: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    Delivered: "bg-green-500/15 text-green-600 dark:text-green-400",
    Cancelled: "bg-red-500/15 text-red-600 dark:text-red-400",
    Returned: "bg-gray-500/15 text-gray-600 dark:text-gray-400",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[status] || "bg-gray-500/15 text-gray-600"}`}>
      {status}
    </span>
  );
}

// Payment Badge Component
function PaymentBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Unpaid: "bg-red-500/15 text-red-600 dark:text-red-400",
    Partial: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
    Paid: "bg-green-500/15 text-green-600 dark:text-green-400",
    Refunded: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[status] || "bg-gray-500/15 text-gray-600"}`}>
      {status}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: "bg-success/15 text-success",
    Pending: "bg-warning/15 text-warning",
    Shipped: "bg-info/15 text-info",
    Refunded: "bg-destructive/15 text-destructive",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs ${map[status] || "bg-muted text-muted-foreground"}`}>{status}</span>;
}
