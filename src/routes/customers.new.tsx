import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { CustomerForm } from "@/components/customers/CustomerForm";

export const Route = createFileRoute("/customers/new")({
  head: () => ({
    meta: [
      { title: "Add Customer — H&M Trads Admin" },
      { name: "description", content: "Create a new B2B or B2C customer record with contact and billing details." },
    ],
  }),
  component: () => (
    <AppShell>
      <Topbar title="Add New Customer" subtitle="Create a B2B or B2C customer profile" />
      <div className="p-4 lg:p-8"><CustomerForm mode="create" /></div>
    </AppShell>
  ),
});
