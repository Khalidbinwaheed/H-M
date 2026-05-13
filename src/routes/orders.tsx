import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { ShoppingCart, FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/StatCard";
import { useState } from "react";
import { useOrderStore } from "@/store/orders";
import { useCustomerStore } from "@/store/customers";
import { useLaptopStore } from "@/store/laptops";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceModal } from "@/components/orders/InvoiceModal";
import { AddOrderModal } from "@/components/orders/AddOrderModal";
import { Order } from "@/types";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Orders — H&M Trads Admin" },
      { name: "description", content: "Manage orders, generate invoices, and track payments." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const orders = useOrderStore((s) => s.orders);
  const customers = useCustomerStore((s) => s.customers);
  const laptops = useLaptopStore((s) => s.laptops);
  
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;
  const unpaidOrders = orders.filter((o) => o.paymentStatus === "Unpaid").length;

  return (
    <AppShell>
      <Topbar 
        title="Orders" 
        subtitle="Manage all customer orders and generate invoices" 
        action={
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all shadow-glow text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            New Order
          </button>
        }
      />
      <div className="p-4 lg:p-8 space-y-6">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Orders" value={orders.length} icon={ShoppingCart} accent="primary" />
          <StatCard title="Pending Fulfillment" value={pendingOrders} icon={Clock} accent="warning" delay={0.05} />
          <StatCard title="Delivered" value={completedOrders} icon={CheckCircle2} accent="success" delay={0.1} />
          <StatCard title="Unpaid Orders" value={unpaidOrders} icon={AlertTriangle} accent="destructive" delay={0.15} />
        </div>

        {/* Orders Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold">Order History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30">
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-6">Order ID / Date</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Payment</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order, i) => {
                  const customer = customers.find((c) => c.id === order.customerId);
                  return (
                    <motion.tr 
                      key={order.id} 
                      initial={{ opacity: 0, x: -8 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: i * 0.02 }} 
                      className="border-t border-border/40 hover:bg-accent/5"
                    >
                      <td className="py-4 px-6">
                        <div className="font-mono text-xs font-semibold">{order.orderNumber}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{formatDate(order.createdAt)}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium">{customer?.name || "Walk-in"}</div>
                        <div className="text-xs text-muted-foreground">{customer?.type || "Unknown"}</div>
                      </td>
                      <td className="py-4 px-6 font-medium text-primary">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-4 px-6">
                        <PaymentBadge status={order.paymentStatus} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => setInvoiceOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg text-xs font-medium transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Generate Invoice
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
                {sortedOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-muted-foreground">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

      {isAddModalOpen && (
        <AddOrderModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </AppShell>
  );
}

// Badges
function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Pending: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
    Processing: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    Shipped: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    Delivered: "bg-green-500/15 text-green-600 dark:text-green-400",
    Cancelled: "bg-red-500/15 text-red-600 dark:text-red-400",
    Returned: "bg-gray-500/15 text-gray-600 dark:text-gray-400",
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colorMap[status] || "bg-gray-500/15 text-gray-600"}`}>{status}</span>;
}

function PaymentBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Unpaid: "bg-red-500/15 text-red-600 dark:text-red-400",
    Partial: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
    Paid: "bg-green-500/15 text-green-600 dark:text-green-400",
    Refunded: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colorMap[status] || "bg-gray-500/15 text-gray-600"}`}>{status}</span>;
}
