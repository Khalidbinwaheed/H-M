import { Customer } from "@/types";
import { Save, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useCustomerStore } from "@/store/customers";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(6, "Phone too short").max(40),
  city: z.string().trim().min(1).max(80),
  country: z.string().trim().min(1).max(80),
  address: z.string().trim().max(240),
});

const blank = (): Customer => ({
  id: crypto.randomUUID(),
  name: "", company: "", type: "B2C", status: "Active",
  email: "", phone: "", city: "", country: "Pakistan", address: "",
  taxId: "", totalOrders: 0, totalSpent: 0,
  lastOrderAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  notes: "",
  avatarColor: "from-primary to-accent",
});

export function CustomerForm({ initial, mode }: { initial?: Customer; mode: "create" | "edit" }) {
  const [data, setData] = useState<Customer>(initial ?? blank());
  const navigate = useNavigate();
  const { add, update } = useCustomerStore();

  const set = <K extends keyof Customer>(k: K, v: Customer[K]) => setData((d) => ({ ...d, [k]: v }));

  const save = () => {
    const result = schema.safeParse(data);
    if (!result.success) { toast.error(result.error.issues[0].message); return; }
    if (mode === "create") { add(data); toast.success("Customer created"); }
    else { update(data.id, data); toast.success("Customer updated"); }
    navigate({ to: "/customers" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2">
        <button onClick={() => navigate({ to: "/customers" })} className="inline-flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm hover:bg-accent/10 transition">
          <X className="h-4 w-4" /> Cancel
        </button>
        <button onClick={save} className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-medium shadow-glow hover:opacity-90 transition">
          <Save className="h-4 w-4" /> {mode === "create" ? "Create Customer" : "Save Changes"}
        </button>
      </div>

      <Section title="Profile">
        <Field label="Customer Type"><Select value={data.type} onChange={(v) => set("type", v as any)} options={["B2B", "B2C"]} /></Field>
        <Field label="Status"><Select value={data.status} onChange={(v) => set("status", v as any)} options={["Active", "VIP", "Inactive", "Blocked"]} /></Field>
        <Field label="Full Name / Company"><Input value={data.name} onChange={(v) => set("name", v)} /></Field>
        {data.type === "B2B" && (
          <>
            <Field label="Company"><Input value={data.company ?? ""} onChange={(v) => set("company", v)} /></Field>
            <Field label="Tax ID / NTN"><Input value={data.taxId ?? ""} onChange={(v) => set("taxId", v)} /></Field>
          </>
        )}
      </Section>

      <Section title="Contact">
        <Field label="Email"><Input type="email" value={data.email} onChange={(v) => set("email", v)} /></Field>
        <Field label="Phone"><Input value={data.phone} onChange={(v) => set("phone", v)} /></Field>
        <Field label="City"><Input value={data.city} onChange={(v) => set("city", v)} /></Field>
        <Field label="Country"><Select value={data.country} onChange={(v) => set("country", v)} options={["Pakistan", "UAE", "KSA", "Qatar", "Oman", "Bahrain"]} /></Field>
        <Field label="Address" full><Input value={data.address} onChange={(v) => set("address", v)} /></Field>
      </Section>

      <Section title="Notes" cols={1}>
        <Field label="Internal notes" full>
          <textarea
            value={data.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
            rows={3}
            maxLength={1000}
            className="w-full bg-input/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
          />
        </Field>
      </Section>
    </div>
  );
}

function Section({ title, children, cols = 3 }: { title: string; children: React.ReactNode; cols?: number }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-sm font-display font-semibold uppercase tracking-wider text-muted-foreground mb-4">{title}</h3>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-4`}>{children}</div>
    </div>
  );
}
function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={`block ${full ? "lg:col-span-3 md:col-span-2" : ""}`}><div className="text-xs text-muted-foreground mb-1">{label}</div>{children}</label>;
}
function Input({ value, onChange, type = "text" }: { value: string; onChange: (v: string) => void; type?: string }) {
  return <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} maxLength={255} className="w-full bg-input/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60" />;
}
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-input/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60">
      {options.map((o) => <option key={o} value={o} className="bg-popover">{o}</option>)}
    </select>
  );
}
