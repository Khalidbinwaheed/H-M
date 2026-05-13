import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { useLaptopStore } from "@/store/laptops";
import { useChargerStore } from "@/store/chargers";
import { StatCard } from "@/components/dashboard/StatCard";
import { Boxes, AlertTriangle, PackageCheck, PackageX, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — H&M Trads Admin" },
      { name: "description", content: "Real-time stock levels and low-stock alerts across laptops and chargers." },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const laptops = useLaptopStore((s) => s.laptops);
  const chargers = useChargerStore((s) => s.chargers);
  const [tab, setTab] = useState<"all" | "low" | "out">("all");

  const items = useMemo(() => {
    const all = [
      ...laptops.map((l) => ({ id: l.id, kind: "Laptop", name: l.name, sku: l.sku, stock: l.stock, value: l.salePrice * l.stock, image: l.imageUrl })),
      ...chargers.map((c) => ({ id: c.id, kind: "Charger", name: c.name, sku: c.sku, stock: c.stock, value: c.salePrice * c.stock, image: c.imageUrl })),
    ];
    if (tab === "low") return all.filter((x) => x.stock > 0 && x.stock <= 3);
    if (tab === "out") return all.filter((x) => x.stock === 0);
    return all;
  }, [laptops, chargers, tab]);

  const totalUnits = laptops.reduce((a, l) => a + l.stock, 0) + chargers.reduce((a, c) => a + c.stock, 0);
  const totalValue = items.reduce((a, i) => a + i.value, 0);
  const lowCount = [...laptops, ...chargers].filter((x) => x.stock > 0 && x.stock <= 3).length;
  const outCount = [...laptops, ...chargers].filter((x) => x.stock === 0).length;

  return (
    <AppShell>
      <Topbar title="Inventory" subtitle="Live stock levels across all SKUs" />
      <div className="p-4 lg:p-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Units" value={totalUnits} icon={Boxes} accent="primary" />
          <StatCard title="Inventory Value" value={`Rs. ${(totalValue / 1000).toFixed(1)}k`} icon={PackageCheck} accent="success" delay={0.05} />
          <StatCard title="Low Stock" value={lowCount} icon={AlertTriangle} accent="warning" delay={0.1} />
          <StatCard title="Out of Stock" value={outCount} icon={PackageX} accent="accent" delay={0.15} />
        </div>

        <div className="glass rounded-2xl p-2 inline-flex gap-1">
          {([["all", "All"], ["low", "Low Stock"], ["out", "Out of Stock"]] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-xl text-sm transition ${tab === k ? "bg-gradient-primary text-primary-foreground shadow-glow" : "hover:bg-accent/10"}`}>{label}</button>
          ))}
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/30">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Kind</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <motion.tr key={i.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-border/40 hover:bg-accent/5">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={i.image} alt={i.name} loading="lazy" className="w-10 h-10 rounded-lg object-cover bg-muted" />
                      <span className="font-medium truncate max-w-[260px]">{i.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-xs bg-muted">{i.kind}</span></td>
                  <td className="py-3 px-4 font-mono text-xs">{i.sku}</td>
                  <td className="py-3 px-4 font-medium">{i.stock}</td>
                  <td className="py-3 px-4 font-medium">{formatCurrency(i.value)}</td>
                  <td className="py-3 px-4">
                    {i.stock === 0 ? <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/15 text-destructive flex items-center gap-1 w-fit"><TrendingDown className="h-3 w-3" /> Out</span>
                      : i.stock <= 3 ? <span className="text-xs px-2 py-0.5 rounded-full bg-warning/15 text-warning">Low</span>
                      : <span className="text-xs px-2 py-0.5 rounded-full bg-success/15 text-success">Healthy</span>}
                  </td>
                </motion.tr>
              ))}
              {items.length === 0 && <tr><td colSpan={6} className="py-16 text-center text-muted-foreground">Nothing here.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
