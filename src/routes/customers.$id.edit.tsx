import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { useCustomerStore } from "@/store/customers";

export const Route = createFileRoute("/customers/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit Customer — H&M Trads Admin" },
      { name: "description", content: "Update contact details, billing info and status of an existing customer." },
    ],
  }),
  component: EditCustomer,
});

function EditCustomer() {
  const { id } = useParams({ from: "/customers/$id/edit" });
  const customer = useCustomerStore((s) => s.getById(id));
  if (!customer) {
    return (
      <AppShell>
        <Topbar title="Customer not found" />
        <div className="p-8"><Link to="/customers" className="text-primary underline">Back to customers</Link></div>
      </AppShell>
    );
  }
  return (
    <AppShell>
      <Topbar title={customer.name} subtitle={customer.email} />
      <div className="p-4 lg:p-8"><CustomerForm mode="edit" initial={customer} /></div>
    </AppShell>
  );
}
