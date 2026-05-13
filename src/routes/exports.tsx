import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { ArrowUpFromLine, Package, MapPin, CheckCircle2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/StatCard";
import { useEffect, useMemo, useState } from "react";
import { fetchInventoryExports, subscribeTable } from "@/lib/supabase/realtime-data";
import { formatCurrency } from "@/lib/utils";
import { AddExportModal } from "@/components/inventory/AddExportModal";

export const Route = createFileRoute("/exports")({
  head: () => ({
    meta: [
      { title: "Exports — H&M Trads Admin" },
      { name: "description", content: "Outbound orders, courier tracking and delivery confirmation." },
    ],
  }),
  component: ExportsPage,
});

function ExportsPage() {
  const [exportsRows, setExportsRows] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await fetchInventoryExports();
      setExportsRows(data);
    };

    load();
    const unsubscribe = subscribeTable("inventory_exports", load);
    return () => unsubscribe();
  }, []);

  const parsed = useMemo(
    () => exportsRows.map((e) => {
      const items = Array.isArray(e.items) ? e.items : [];
      const units = items.reduce((sum: number, item: any) => sum + Number(item.quantity ?? 0), 0);
      const customerData = e.customers as any;
      const destination = customerData ? `${customerData.city}, ${customerData.country}` : "N/A";
      
      return {
        id: String(e.id).slice(0, 8).toUpperCase(),
        customer: customerData?.name ?? "Unknown",
        destination: destination !== "undefined, undefined" ? destination : "N/A",
        courier: "Self Delivery",
        units,
        value: Number(e.total_revenue ?? 0),
        status: e.delivery_status ?? "Pending",
      };
    }),
    [exportsRows],
  );

  return (
    <AppShell>
      <Topbar title="Exports" subtitle="Outbound shipments and delivery tracking" />
      <div className="p-4 lg:p-8 space-y-6">
        <div className="flex justify-end">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-glow text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Log New Export
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Exports" value={parsed.length} icon={ArrowUpFromLine} accent="primary" />
          <StatCard title="Units Shipped" value={parsed.reduce((a, e) => a + e.units, 0)} icon={Package} accent="accent" delay={0.05} />
          <StatCard title="Destinations" value={parsed.filter((e) => e.destination !== "N/A").length} icon={MapPin} accent="success" delay={0.1} />
          <StatCard title="Delivered" value={parsed.filter((e) => e.status === "Delivered").length} icon={CheckCircle2} accent="warning" delay={0.15} />
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/30">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Export</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Courier</th>
                <th className="py-3 px-4">Units</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {parsed.map((e, i) => (
                <motion.tr key={e.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="border-t border-border/40 hover:bg-accent/5">
                  <td className="py-3 px-4 font-mono text-xs">{e.id}</td>
                  <td className="py-3 px-4 font-medium">{e.customer}</td>
                  <td className="py-3 px-4">{e.destination}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-xs bg-muted">{e.courier}</span></td>
                  <td className="py-3 px-4">{e.units}</td>
                  <td className="py-3 px-4 font-medium">{formatCurrency(e.value)}</td>
                  <td className="py-3 px-4"><StatusPill status={e.status} /></td>
                </motion.tr>
              ))}
              {parsed.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted-foreground">No exports found in database.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isAddModalOpen && <AddExportModal onClose={() => setIsAddModalOpen(false)} />}
    </AppShell>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Pending": "bg-muted text-muted-foreground",
    "In Transit": "bg-info/15 text-info",
    "Out for Delivery": "bg-warning/15 text-warning",
    "Delivered": "bg-success/15 text-success",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs ${map[status]}`}>{status}</span>;
}
