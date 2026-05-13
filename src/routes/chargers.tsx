import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { useChargerStore } from "@/store/chargers";
import { Charger } from "@/types";
import { useMemo, useState } from "react";
import { Plug, Search, Plus, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/chargers")({
  head: () => ({
    meta: [
      { title: "Chargers — H&M Trads Admin" },
      { name: "description", content: "Manage charger inventory: pin types, wattage, compatibility, originals and prices." },
      { property: "og:title", content: "Charger Inventory — H&M Trads" },
    ],
  }),
  component: ChargersPage,
});

function ChargersPage() {
  const { chargers, remove, add } = useChargerStore();
  const [search, setSearch] = useState("");
  const [pin, setPin] = useState("All");
  const [open, setOpen] = useState(false);

  const pins = useMemo(() => ["All", ...Array.from(new Set(chargers.map((c) => c.pinType)))], [chargers]);
  const filtered = chargers.filter((c) =>
    (pin === "All" || c.pinType === pin) &&
    (!search || `${c.name} ${c.brand} ${c.sku}`.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AppShell>
      <Topbar title="Chargers" subtitle={`${filtered.length} of ${chargers.length} chargers`} action={
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium shadow-glow">
          <Plus className="h-4 w-4" /> New Charger
        </button>
      } />
      <div className="p-4 lg:p-8 space-y-6">
        <div className="glass rounded-2xl p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chargers…" className="w-full bg-input/40 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60" />
          </div>
          <select value={pin} onChange={(e) => setPin(e.target.value)} className="bg-input/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60">
            {pins.map((p) => <option key={p} className="bg-popover">{p}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass rounded-2xl p-4 group hover:shadow-glow transition">
              <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-3">
                <img src={c.imageUrl} alt={c.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{c.sku}</div>
                </div>
                <button onClick={() => { remove(c.id); toast.success("Charger removed"); }} className="p-1.5 rounded-lg hover:bg-destructive/15 text-destructive transition">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                <Tag>{c.pinType}</Tag>
                <Tag accent>{c.wattage}</Tag>
                <Tag>{c.condition}</Tag>
                {c.original && <Tag accent>Original</Tag>}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{c.stock} in stock</span>
                <span className="text-base font-semibold">{formatCurrency(c.salePrice)}</span>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full glass rounded-2xl p-16 text-center text-muted-foreground">
              <Plug className="h-10 w-10 mx-auto mb-3 opacity-40" /> No chargers found
            </div>
          )}
        </div>
      </div>

      {open && <NewChargerModal onClose={() => setOpen(false)} onSave={(c) => { add(c); toast.success("Charger added"); setOpen(false); }} />}
    </AppShell>
  );
}

function Tag({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return <span className={`px-2 py-0.5 rounded-full ${accent ? "bg-primary/15 text-primary" : "bg-muted text-foreground/70"}`}>{children}</span>;
}

function NewChargerModal({ onClose, onSave }: { onClose: () => void; onSave: (c: Charger) => void }) {
  const [d, setD] = useState<Charger>({
    id: crypto.randomUUID(), name: "", brand: "Lenovo", pinType: "Type-C", wattage: "65W",
    voltage: "20V", amperage: "3.25A", compatibility: ["Lenovo"], condition: "New",
    original: true, stock: 0, costPrice: 0, salePrice: 0, sku: `CHG-${Math.floor(Math.random() * 9000 + 1000)}`,
    imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400",
  });
  const set = <K extends keyof Charger>(k: K, v: Charger[K]) => setD((x) => ({ ...x, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong rounded-2xl p-6 w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold">New Charger</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent/10"><X className="h-4 w-4" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <F label="Name"><I value={d.name} onChange={(v) => set("name", v)} /></F>
          <F label="Brand"><I value={d.brand} onChange={(v) => set("brand", v)} /></F>
          <F label="Pin Type"><S value={d.pinType} onChange={(v) => set("pinType", v)} options={["Type-C", "Lenovo Pin", "Dell Pin", "HP Pin", "MagSafe", "Universal"]} /></F>
          <F label="Wattage"><S value={d.wattage} onChange={(v) => set("wattage", v)} options={["45W", "65W", "90W", "120W", "180W", "240W"]} /></F>
          <F label="Voltage"><I value={d.voltage} onChange={(v) => set("voltage", v)} /></F>
          <F label="Amperage"><I value={d.amperage} onChange={(v) => set("amperage", v)} /></F>
          <F label="Stock"><I type="number" value={String(d.stock)} onChange={(v) => set("stock", Number(v))} /></F>
          <F label="Sale Price (Rs.)"><I type="number" value={String(d.salePrice)} onChange={(v) => set("salePrice", Number(v))} /></F>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="glass rounded-xl px-4 py-2.5 text-sm">Cancel</button>
          <button onClick={() => { if (!d.name) return toast.error("Name required"); onSave(d); }} className="bg-gradient-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-medium shadow-glow">Save</button>
        </div>
      </motion.div>
    </div>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="text-xs text-muted-foreground mb-1">{label}</div>{children}</label>;
}
function I({ value, onChange, type = "text" }: { value: string; onChange: (v: string) => void; type?: string }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-input/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60" />;
}
function S({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-input/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60">{options.map((o) => <option key={o} className="bg-popover">{o}</option>)}</select>;
}
