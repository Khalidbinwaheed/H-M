import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { LaptopForm } from "@/components/laptops/LaptopForm";
import { useLaptopStore } from "@/store/laptops";

export const Route = createFileRoute("/laptops/$id")({
  head: () => ({
    meta: [
      { title: "Edit Laptop — H&M Trads Admin" },
      { name: "description", content: "Edit specifications, pricing and stock for a laptop in the H&M Trads inventory." },
    ],
  }),
  component: EditLaptop,
});

function EditLaptop() {
  const { id } = useParams({ from: "/laptops/$id" });
  const laptop = useLaptopStore((s) => s.getById(id));

  if (!laptop) {
    return (
      <AppShell>
        <Topbar title="Laptop not found" />
        <div className="p-8">
          <Link to="/laptops" className="text-primary underline">Back to laptops</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Topbar title={laptop.name} subtitle={`SKU: ${laptop.sku}`} />
      <div className="p-4 lg:p-8">
        <LaptopForm mode="edit" initial={laptop} />
      </div>
    </AppShell>
  );
}
