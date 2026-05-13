import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { ArrowDownToLine, Truck, Plane, Ship, Package, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/StatCard";
import { useEffect, useMemo, useState } from "react";
import { fetchInventoryImports, subscribeTable } from "@/lib/supabase/realtime-data";
import { formatCurrency } from "@/lib/utils";
import { AddImportModal } from "@/components/inventory/AddImportModal";

export const Route = createFileRoute("/imports")({
  head: () => ({
    meta: [
      { title: "Imports — H&M Trads Admin" },
      { name: "description", content: "Track inbound shipments, customs status, ETA and supplier details." },
    ],
  }),
  component: ImportsPage,
});

const methodIcon = { Sea: Ship, Air: Plane, Land: Truck } as const;

function ImportsPage() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await fetchInventoryImports();
      setShipments(data);
    };

    load();
    const unsubscribe = subscribeTable("inventory_imports", load);
    return () => unsubscribe();
  }, []);

  const parsed = useMemo(() => shipments.map((s) => {
    const items = Array.isArray(s.items) ? s.items : [];
    const units = items.reduce((sum: number, item: any) => sum + Number(item.quantity ?? 0), 0);
    const method = "Land" as const;
    return {
      id: String(s.id).slice(0, 8).toUpperCase(),
      supplier: s.supplier_name ?? "Unknown",
      origin: "N/A",
      method,
      units,
      value: Number(s.total_cost ?? 0),
      eta: new Date(s.date).toLocaleDateString(),
      status: "Recorded",
    };
  }), [shipments]);

  const totalUnits = parsed.reduce((a, s) => a + s.units, 0);
  const totalValue = parsed.reduce((a, s) => a + s.value, 0);

  return (
    <AppShell>
      <Topbar title="Imports" subtitle="Inbound shipments and customs tracking" />
      <div className="p-4 lg:p-8 space-y-6">
        <div className="flex justify-end">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-glow text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Log New Import
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Imports" value={parsed.length} icon={ArrowDownToLine} accent="primary" />
          <StatCard title="Units Inbound" value={totalUnits} icon={Package} accent="accent" delay={0.05} />
          <StatCard title="Value" value={formatCurrency(totalValue)} icon={Plane} accent="success" delay={0.1} />
          <StatCard title="Latest 7d" value={parsed.filter((s) => Date.now() - new Date(s.eta).getTime() <= 7 * 86400000).length} icon={Truck} accent="warning" delay={0.15} />
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/30">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Shipment</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Origin</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Units</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">ETA</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {parsed.map((s, i) => {
                const Icon = methodIcon[s.method as keyof typeof methodIcon];
                return (
                  <motion.tr key={s.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="border-t border-border/40 hover:bg-accent/5">
                    <td className="py-3 px-4 font-mono text-xs">{s.id}</td>
                    <td className="py-3 px-4 font-medium">{s.supplier}</td>
                    <td className="py-3 px-4">{s.origin}</td>
                    <td className="py-3 px-4"><span className="inline-flex items-center gap-2 text-xs"><Icon className="h-4 w-4 text-primary" /> {s.method}</span></td>
                    <td className="py-3 px-4">{s.units}</td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(s.value)}</td>
                    <td className="py-3 px-4 text-muted-foreground">{s.eta}</td>
                    <td className="py-3 px-4"><StatusPill status={s.status} /></td>
                  </motion.tr>
                );
              })}
              {parsed.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground">No imports found in database.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isAddModalOpen && <AddImportModal onClose={() => setIsAddModalOpen(false)} />}
    </AppShell>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "In Transit": "bg-info/15 text-info",
    "Customs": "bg-warning/15 text-warning",
    "Cleared": "bg-primary/15 text-primary",
    "Delivered": "bg-success/15 text-success",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs ${map[status]}`}>{status}</span>;
}
