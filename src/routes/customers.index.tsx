import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { useCustomerStore } from "@/store/customers";
import { useMemo, useState } from "react";
import { Search, Filter, Plus, Trash2, Pencil, ChevronLeft, ChevronRight, Mail, Phone, Eye, Users, Crown, UserCheck, UserX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/customers/")({
  head: () => ({
    meta: [
      { title: "Customers — H&M Trads Admin" },
      { name: "description", content: "Manage B2B and B2C customers, segments, lifetime value, and contact details for H&M Trads." },
      { property: "og:title", content: "Customer Management — H&M Trads" },
    ],
  }),
  component: CustomersList,
});

function CustomersList() {
  const { customers, removeMany, remove } = useCustomerStore();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [country, setCountry] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const countries = useMemo(() => ["All", ...Array.from(new Set(customers.map((c) => c.country)))], [customers]);

  const stats = useMemo(() => ({
    total: customers.length,
    vip: customers.filter((c) => c.status === "VIP").length,
    active: customers.filter((c) => c.status === "Active").length,
    blocked: customers.filter((c) => c.status === "Blocked").length,
    revenue: customers.reduce((a, c) => a + c.totalSpent, 0),
  }), [customers]);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (search && !`${c.name} ${c.email} ${c.phone} ${c.company ?? ""}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (type !== "All" && c.type !== type) return false;
      if (status !== "All" && c.status !== status) return false;
      if (country !== "All" && c.country !== country) return false;
      return true;
    });
  }, [customers, search, type, status, country]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);
  const toggleSel = (id: string) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const allSel = pageItems.length > 0 && pageItems.every((c) => selected.includes(c.id));

  return (
    <AppShell>
      <Topbar title="Customers" subtitle={`${filtered.length} of ${customers.length} customers`} />
      <div className="p-4 lg:p-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total" value={stats.total} icon={Users} accent="primary" delay={0} />
          <StatCard title="VIP" value={stats.vip} icon={Crown} accent="warning" delay={0.05} />
          <StatCard title="Active" value={stats.active} icon={UserCheck} accent="success" delay={0.1} />
          <StatCard title="Blocked" value={stats.blocked} icon={UserX} accent="accent" delay={0.15} />
        </div>

        <div className="glass rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, email, phone, company…"
              className="w-full bg-input/40 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/60"
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters((v) => !v)} className="inline-flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm hover:bg-accent/10 transition">
              <Filter className="h-4 w-4" /> Filters
            </button>
            {selected.length > 0 && (
              <button onClick={() => { removeMany(selected); setSelected([]); }} className="inline-flex items-center gap-2 bg-destructive/15 text-destructive rounded-xl px-4 py-2.5 text-sm hover:bg-destructive/25 transition">
                <Trash2 className="h-4 w-4" /> Delete ({selected.length})
              </button>
            )}
            <Link to="/customers/new" className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium shadow-glow hover:opacity-90 transition">
              <Plus className="h-4 w-4" /> New Customer
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass rounded-2xl p-4 grid grid-cols-2 lg:grid-cols-3 gap-3">
              <FilterSelect label="Type" value={type} onChange={setType} options={["All", "B2B", "B2C"]} />
              <FilterSelect label="Status" value={status} onChange={setStatus} options={["All", "Active", "VIP", "Inactive", "Blocked"]} />
              <FilterSelect label="Country" value={country} onChange={setCountry} options={countries} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30">
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4"><input type="checkbox" checked={allSel} onChange={(e) => setSelected(e.target.checked ? pageItems.map((c) => c.id) : [])} /></th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Orders</th>
                  <th className="py-3 px-4">Lifetime Value</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((c) => (
                  <tr key={c.id} className="border-t border-border/40 hover:bg-accent/5 transition">
                    <td className="py-3 px-4"><input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSel(c.id)} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.avatarColor} grid place-items-center text-sm font-semibold text-primary-foreground shrink-0`}>{c.name[0]}</div>
                        <div className="min-w-0">
                          <div className="font-medium truncate max-w-[200px]">{c.name}</div>
                          {c.company && c.type === "B2B" && <div className="text-xs text-muted-foreground truncate max-w-[200px]">{c.company}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${c.type === "B2B" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>{c.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs flex items-center gap-1 text-muted-foreground"><Mail className="h-3 w-3" />{c.email}</div>
                      <div className="text-xs flex items-center gap-1 text-muted-foreground mt-0.5"><Phone className="h-3 w-3" />{c.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-xs">{c.city}, {c.country}</td>
                    <td className="py-3 px-4 text-center">{c.totalOrders}</td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(c.totalSpent)}</td>
                    <td className="py-3 px-4"><StatusPill status={c.status} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link to="/customers/$id" params={{ id: c.id }} className="p-2 rounded-lg hover:bg-accent/10 transition" title="View"><Eye className="h-4 w-4" /></Link>
                        <Link to="/customers/$id/edit" params={{ id: c.id }} className="p-2 rounded-lg hover:bg-accent/10 transition" title="Edit"><Pencil className="h-4 w-4" /></Link>
                        <button onClick={() => remove(c.id)} className="p-2 rounded-lg hover:bg-destructive/15 text-destructive transition" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr><td colSpan={9} className="py-16 text-center text-muted-foreground">No customers match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-4 border-t border-border/40">
            <div className="text-xs text-muted-foreground">Page {page} of {totalPages} · Total LTV {formatCurrency(stats.revenue)}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg glass disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg glass disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
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

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-success/15 text-success",
    VIP: "bg-warning/15 text-warning",
    Inactive: "bg-muted text-muted-foreground",
    Blocked: "bg-destructive/15 text-destructive",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs ${map[status]}`}>{status}</span>;
}
