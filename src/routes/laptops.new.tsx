import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { LaptopForm } from "@/components/laptops/LaptopForm";

export const Route = createFileRoute("/laptops/new")({
  head: () => ({
    meta: [
      { title: "Add Laptop — H&M Trads Admin" },
      { name: "description", content: "Add a new laptop to inventory with full processor, RAM, storage, GPU, display, battery and charger specs." },
    ],
  }),
  component: NewLaptop,
});

function NewLaptop() {
  return (
    <AppShell>
      <Topbar title="Add New Laptop" subtitle="Enter complete specifications" />
      <div className="p-4 lg:p-8">
        <LaptopForm mode="create" />
      </div>
    </AppShell>
  );
}
