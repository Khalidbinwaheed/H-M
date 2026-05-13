import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { useState } from "react";
import { Save, User, Building2, Bell, Shield, Palette } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — H&M Trads Admin" },
      { name: "description", content: "Manage profile, business information, notifications, security and appearance settings." },
    ],
  }),
  component: SettingsPage,
});

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "business", label: "Business", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
] as const;

function SettingsPage() {
  const [tab, setTab] = useState<typeof tabs[number]["id"]>("profile");
  return (
    <AppShell>
      <Topbar title="Settings" subtitle="Manage your account and workspace" />
      <div className="p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <nav className="glass rounded-2xl p-2 h-fit lg:sticky lg:top-24 flex lg:flex-col gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition shrink-0 ${tab === t.id ? "bg-gradient-primary text-primary-foreground shadow-glow" : "hover:bg-accent/10"}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>

        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {tab === "profile" && <Profile />}
          {tab === "business" && <Business />}
          {tab === "notifications" && <Notifications />}
          {tab === "security" && <Security />}
          {tab === "appearance" && <Appearance />}
        </motion.div>
      </div>
    </AppShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-lg font-display font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="text-xs text-muted-foreground mb-1.5">{label}</div>{children}</label>;
}
function I(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full bg-input/40 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60" />;
}
function SaveBar({ onSave }: { onSave: () => void }) {
  return (
    <div className="flex justify-end">
      <button onClick={onSave} className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-medium shadow-glow hover:opacity-90 transition">
        <Save className="h-4 w-4" /> Save changes
      </button>
    </div>
  );
}

function Profile() {
  const user = useAuthStore((s) => s.user);
  return (
    <>
      <Card title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <F label="Full Name"><I defaultValue={user?.name || ""} /></F>
          <F label="Email"><I type="email" defaultValue={user?.email || ""} disabled /></F>
          <F label="Phone"><I defaultValue="+92 300 1234567" /></F>
          <F label="Role"><I defaultValue={user?.role || ""} disabled /></F>
        </div>
      </Card>
      <SaveBar onSave={() => toast.success("Profile updated")} />
    </>
  );
}
function Business() {
  return (
    <>
      <Card title="Business Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <F label="Business Name"><I defaultValue="H&M Trads" /></F>
          <F label="Tax ID / NTN"><I defaultValue="NTN-1234567" /></F>
          <F label="Address"><I defaultValue="Hall Road, Lahore, Pakistan" /></F>
          <F label="Currency"><I defaultValue="PKR (Rs.)" /></F>
          <F label="Phone"><I defaultValue="+92 42 1234567" /></F>
          <F label="Website"><I defaultValue="https://hmtrads.com" /></F>
        </div>
      </Card>
      <SaveBar onSave={() => toast.success("Business info saved")} />
    </>
  );
}
function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [v, setV] = useState(defaultChecked);
  return (
    <button type="button" onClick={() => setV(!v)} className={`w-12 h-7 rounded-full relative transition ${v ? "bg-gradient-primary" : "bg-input/60"}`}>
      <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-background transition ${v ? "translate-x-5" : ""}`} />
    </button>
  );
}
function Notifications() {
  const items = [
    ["Email — New orders", true],
    ["Email — Low stock alerts", true],
    ["Email — Daily summary", false],
    ["Push — Customer messages", true],
    ["Push — Inventory updates", false],
    ["SMS — Critical alerts", false],
  ] as const;
  return (
    <>
      <Card title="Notification Preferences">
        <div className="divide-y divide-border/40">
          {items.map(([label, def]) => (
            <div key={label} className="flex items-center justify-between py-3">
              <span className="text-sm">{label}</span>
              <Toggle defaultChecked={def} />
            </div>
          ))}
        </div>
      </Card>
      <SaveBar onSave={() => toast.success("Preferences saved")} />
    </>
  );
}
function Security() {
  return (
    <>
      <Card title="Change Password">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <F label="Current password"><I type="password" /></F>
          <div />
          <F label="New password"><I type="password" /></F>
          <F label="Confirm new password"><I type="password" /></F>
        </div>
      </Card>
      <Card title="Two-Factor Authentication">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Enable 2FA</div>
            <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security with TOTP authentication.</p>
          </div>
          <Toggle />
        </div>
      </Card>
      <SaveBar onSave={() => toast.success("Security updated")} />
    </>
  );
}
function Appearance() {
  return (
    <>
      <Card title="Theme">
        <div className="grid grid-cols-3 gap-4">
          {["Dark Glass", "Midnight", "Aurora"].map((t, i) => (
            <button key={t} className={`glass rounded-2xl p-4 text-left hover:shadow-glow transition ${i === 0 ? "ring-2 ring-primary" : ""}`}>
              <div className="h-20 rounded-lg bg-gradient-primary mb-3 opacity-80" />
              <div className="text-sm font-medium">{t}</div>
              {i === 0 && <div className="text-xs text-primary mt-1">Active</div>}
            </button>
          ))}
        </div>
      </Card>
      <SaveBar onSave={() => toast.success("Theme applied")} />
    </>
  );
}
