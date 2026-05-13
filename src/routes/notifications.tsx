import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { useEffect, useMemo, useState } from "react";
import { Bell, Package, AlertTriangle, ShoppingCart, UserPlus, CheckCheck, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useLaptopStore } from "@/store/laptops";
import { useOrderStore } from "@/store/orders";
import { useCustomerStore } from "@/store/customers";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — H&M Trads Admin" },
      { name: "description", content: "Real-time alerts for orders, low stock, customer activity and system events." },
    ],
  }),
  component: NotificationsPage,
});

const colorClass: Record<string, string> = {
  warning: "bg-warning/15 text-warning",
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  info: "bg-info/15 text-info",
  destructive: "bg-destructive/15 text-destructive",
};

function NotificationsPage() {
  const laptops = useLaptopStore((s) => s.laptops as any[]);
  const customers = useCustomerStore((s) => s.customers as any[]);
  const orders = useOrderStore((s) => s.orders as any[]);

  const generated = useMemo(() => {
    const lowStock = laptops
      .filter((l) => Number(l.stock ?? l.currentQuantity ?? 0) <= Number(l.reorderLevel ?? 3))
      .slice(0, 5)
      .map((l, index) => ({
        id: `low-${l.id}`,
        icon: AlertTriangle,
        color: Number(l.stock ?? l.currentQuantity ?? 0) === 0 ? "destructive" : "warning",
        title: Number(l.stock ?? l.currentQuantity ?? 0) === 0 ? "Out of stock" : "Low stock alert",
        body: `${l.name} — ${Number(l.stock ?? l.currentQuantity ?? 0)} units remaining.`,
        time: new Date(l.updatedAt ?? l.createdAt ?? Date.now()).toLocaleString(),
        read: index > 1,
      }));

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((o, index) => ({
        id: `ord-${o.id}`,
        icon: ShoppingCart,
        color: "primary",
        title: `Order ${o.orderNumber}`,
        body: `Order total ${o.total.toLocaleString("en-PK")} PKR.`,
        time: new Date(o.createdAt).toLocaleString(),
        read: index > 1,
      }));

    const newCustomers = [...customers]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map((c, index) => ({
        id: `cus-${c.id}`,
        icon: UserPlus,
        color: "success",
        title: "New customer",
        body: `${c.name} joined as ${c.type}.`,
        time: new Date(c.createdAt).toLocaleString(),
        read: index > 0,
      }));

    const paidOrders = orders
      .filter((o) => o.paymentStatus === "Paid")
      .slice(0, 3)
      .map((o) => ({
        id: `paid-${o.id}`,
        icon: Package,
        color: "info",
        title: "Payment received",
        body: `${o.orderNumber} is marked paid.`,
        time: new Date(o.updatedAt ?? o.createdAt).toLocaleString(),
        read: true,
      }));

    return [...lowStock, ...recentOrders, ...newCustomers, ...paidOrders]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 20);
  }, [customers, laptops, orders]);

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(generated);
  }, [generated]);

  const unread = items.filter((i) => !i.read).length;

  return (
    <AppShell>
      <Topbar title="Notifications" subtitle={`${unread} unread`} action={
        <div className="flex gap-2">
          <button onClick={() => { setItems((x) => x.map((i) => ({ ...i, read: true }))); toast.success("All marked as read"); }} className="inline-flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm hover:bg-accent/10 transition">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        </div>
      } />
      <div className="p-4 lg:p-8 max-w-3xl space-y-3">
        <AnimatePresence>
          {items.map((n) => {
            const Icon = n.icon;
            return (
              <motion.div key={n.id} layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className={`glass rounded-2xl p-4 flex items-start gap-4 ${!n.read ? "border-l-4 border-primary" : ""}`}>
                <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${colorClass[n.color]}`}><Icon className="h-5 w-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{n.title}</div>
                    <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
                </div>
                <button onClick={() => setItems((x) => x.filter((i) => i.id !== n.id))} className="p-2 rounded-lg hover:bg-destructive/15 text-destructive transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {items.length === 0 && (
          <div className="glass rounded-2xl p-16 text-center text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-40" /> You're all caught up.
          </div>
        )}
      </div>
    </AppShell>
  );
}
