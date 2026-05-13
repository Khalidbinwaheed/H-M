import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { useCustomerStore } from "@/store/customers";
import { Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, Pencil, ArrowLeft, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/customers/$id/")({
  head: () => ({
    meta: [
      { title: "Customer Profile — H&M Trads Admin" },
      { name: "description", content: "View customer profile, order history, lifetime value and recent activity." },
    ],
  }),
  component: CustomerDetail,
});

function CustomerDetail() {
  const { id } = useParams({ from: "/customers/$id/" });
  const customer = useCustomerStore((s) => s.getById(id));

  if (!customer) {
    return (
      <AppShell>
        <Topbar title="Customer not found" />
        <div className="p-8"><Link to="/customers" className="text-primary underline">Back to customers</Link></div>
      </AppShell>
    );
  }

  const trend = Array.from({ length: 6 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
    spent: Math.round(((customer.totalAmount || 0) / 6) * (0.6 + Math.random() * 0.8)),
  }));

  return (
    <AppShell>
      <Topbar
        title={customer.name}
        subtitle={`${customer.type} · Customer since ${new Date(customer.createdAt).toLocaleDateString()}`}
        action={
          <div className="flex gap-2">
            <Link to="/customers" className="inline-flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm hover:bg-accent/10 transition">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <Link to="/customers/$id/edit" params={{ id: customer.id }} className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium shadow-glow hover:opacity-90 transition">
              <Pencil className="h-4 w-4" /> Edit
            </Link>
          </div>
        }
      />
      <div className="p-4 lg:p-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 xl:col-span-1">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center text-2xl font-bold text-primary-foreground shadow-glow`}>{customer.name[0]}</div>
          <h2 className="mt-4 text-xl font-display font-semibold">{customer.name}</h2>
          {customer.company && <p className="text-sm text-muted-foreground">{customer.company}</p>}
          <div className="mt-4 flex gap-2">
            <span className={`px-2 py-0.5 rounded-full text-xs ${customer.type === "B2B" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>{customer.type}</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-success/15 text-success">{customer.isActive ? "Active" : "Inactive"}</span>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <Row icon={Mail} label={customer.email} />
            <Row icon={Phone} label={customer.phone} />
            <Row icon={MapPin} label={`${customer.address}, ${customer.city}, ${customer.country}`} />
            <Row icon={Calendar} label={`Last order ${customer.lastPurchaseDate ? new Date(customer.lastPurchaseDate).toLocaleDateString() : "Never"}`} />
            {customer.taxId && <Row icon={FileText} label={`Tax ID: ${customer.taxId}`} />}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Stat icon={ShoppingBag} label="Total Orders" value={(customer.totalPurchases || 0).toString()} accent="from-primary/30" />
            <Stat icon={DollarSign} label="Lifetime Value" value={formatCurrency(customer.totalAmount || 0)} accent="from-success/30" />
            <Stat icon={DollarSign} label="Avg Order" value={formatCurrency(Math.round((customer.totalAmount || 0) / Math.max(1, customer.totalPurchases || 1)))} accent="from-accent/30" />
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-display font-semibold">Spending Trend</h3>
            <p className="text-xs text-muted-foreground mb-4">Last 6 months</p>
            <div className="h-64">
              <ResponsiveContainer>
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="cust-spend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.18 265)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="oklch(0.72 0.18 265)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="oklch(0.7 0.03 260)" fontSize={12} />
                  <YAxis stroke="oklch(0.7 0.03 260)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.025 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="spent" stroke="oklch(0.72 0.18 265)" strokeWidth={2} fill="url(#cust-spend)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {customer.notes && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-display font-semibold uppercase tracking-wider text-muted-foreground mb-2">Notes</h3>
              <p className="text-sm">{customer.notes}</p>
            </div>
          )}
        </motion.div>
      </div>
    </AppShell>
  );
}

function Row({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-start gap-3 text-muted-foreground">
      <Icon className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
      <span className="text-foreground/90 break-words">{label}</span>
    </div>
  );
}
function Stat({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent: string }) {
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden">
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${accent} to-transparent blur-2xl`} />
      <Icon className="h-5 w-5 text-primary relative" />
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-3 relative">{label}</div>
      <div className="text-2xl font-display font-bold mt-1 relative">{value}</div>
    </div>
  );
}
