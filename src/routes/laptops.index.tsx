import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { useLaptopStore } from "@/store/laptops";
import { useMemo, useState } from "react";
import { Search, Filter, Plus, Trash2, Pencil, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/laptops/")({
  head: () => ({
    meta: [
      { title: "Laptops — H&M Trads Admin" },
      { name: "description", content: "Manage the full laptop inventory: brands, processors, RAM, storage, GPU, display, battery and chargers." },
      { property: "og:title", content: "Laptop Inventory — H&M Trads" },
    ],
  }),
  component: LaptopsList,
});

function LaptopsList() {
  const { laptops, removeMany, remove } = useLaptopStore();
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All");
  const [condition, setCondition] = useState("All");
  const [pBrand, setPBrand] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const brands = useMemo(() => ["All", ...Array.from(new Set(laptops.map((l) => l.brand)))], [laptops]);

  const filtered = useMemo(() => {
    return laptops.filter((l) => {
      if (search && !`${l.name} ${l.brand} ${l.sku} ${l.modelNumber}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (brand !== "All" && l.brand !== brand) return false;
      if (condition !== "All" && l.condition !== condition) return false;
      if (pBrand !== "All" && l.processorBrand !== pBrand) return false;
      if (stockFilter === "In Stock" && l.stock <= 0) return false;
      if (stockFilter === "Low Stock" && (l.stock === 0 || l.stock > 3)) return false;
      if (stockFilter === "Out of Stock" && l.stock > 0) return false;
      return true;
    });
  }, [laptops, search, brand, condition, pBrand, stockFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSel = (id: string) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const allSel = pageItems.length > 0 && pageItems.every((l) => selected.includes(l.id));

  return (
    <AppShell>
      <Topbar title="Laptops" subtitle={`${filtered.length} of ${laptops.length} laptops`} />
      <div className="p-4 lg:p-8 space-y-4">
        <div className="glass rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, brand, SKU, model…"
              className="w-full bg-input/40 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/60"
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters((v) => !v)} className="inline-flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm hover:bg-accent/10 transition">
              <Filter className="h-4 w-4" /> Filters
            </button>
            {selected.length > 0 && (
              <button
                onClick={() => { removeMany(selected); setSelected([]); }}
                className="inline-flex items-center gap-2 bg-destructive/15 text-destructive rounded-xl px-4 py-2.5 text-sm hover:bg-destructive/25 transition"
              >
                <Trash2 className="h-4 w-4" /> Delete ({selected.length})
              </button>
            )}
            <Link to="/laptops/new" className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium shadow-glow hover:opacity-90 transition">
              <Plus className="h-4 w-4" /> New Laptop
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass rounded-2xl p-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <FilterSelect label="Brand" value={brand} onChange={setBrand} options={brands} />
              <FilterSelect label="Condition" value={condition} onChange={setCondition} options={["All", "New", "Used", "Refurbished"]} />
              <FilterSelect label="Processor Brand" value={pBrand} onChange={setPBrand} options={["All", "Intel", "Ryzen"]} />
              <FilterSelect label="Stock" value={stockFilter} onChange={setStockFilter} options={["All", "In Stock", "Low Stock", "Out of Stock"]} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30">
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4">
                    <input type="checkbox" checked={allSel} onChange={(e) => setSelected(e.target.checked ? pageItems.map((l) => l.id) : [])} />
                  </th>
                  <th className="py-3 px-4">Laptop</th>
                  <th className="py-3 px-4">Processor</th>
                  <th className="py-3 px-4">RAM / Storage</th>
                  <th className="py-3 px-4">GPU</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((l) => (
                  <tr key={l.id} className="border-t border-border/40 hover:bg-accent/5 transition">
                    <td className="py-3 px-4"><input type="checkbox" checked={selected.includes(l.id)} onChange={() => toggleSel(l.id)} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={l.imageUrl} alt={l.name} loading="lazy" className="w-12 h-12 rounded-lg object-cover bg-muted" />
                        <div className="min-w-0">
                          <div className="font-medium truncate max-w-[220px]">{l.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{l.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs">{l.processorBrand} {l.processorCategory} {l.processorModel}{l.processorSuffix}</td>
                    <td className="py-3 px-4 text-xs">{l.ramSize} {l.ramType} · {l.storageSize} {l.storageType}</td>
                    <td className="py-3 px-4 text-xs">{l.gpuType === "Dedicated" ? `${l.gpuSeries} ${l.gpuModel}` : "Integrated"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${l.condition === "New" ? "bg-success/15 text-success" : l.condition === "Used" ? "bg-warning/15 text-warning" : "bg-info/15 text-info"}`}>{l.condition}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StockBadge stock={l.stock} />
                    </td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(l.salePrice)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link to="/laptops/$id" params={{ id: l.id }} className="p-2 rounded-lg hover:bg-accent/10 transition" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button onClick={() => remove(l.id)} className="p-2 rounded-lg hover:bg-destructive/15 text-destructive transition" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr><td colSpan={9} className="py-16 text-center text-muted-foreground">No laptops match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-4 border-t border-border/40">
            <div className="text-xs text-muted-foreground">Page {page} of {totalPages}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg glass disabled:opacity-40">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg glass disabled:opacity-40">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-input/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60">
        {options.map((o) => <option key={o} value={o} className="bg-popover">{o}</option>)}
      </select>
    </label>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="px-2 py-0.5 rounded-full text-xs bg-destructive/15 text-destructive">Out</span>;
  if (stock <= 3) return <span className="px-2 py-0.5 rounded-full text-xs bg-warning/15 text-warning">Low · {stock}</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs bg-success/15 text-success">{stock} units</span>;
}
