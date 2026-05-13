import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createInventoryImport } from "@/lib/supabase/realtime-data";

export function AddImportModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    supplier_name: "",
    total_cost: "",
    date: new Date().toISOString().split("T")[0],
    quantity: "1",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createInventoryImport({
        supplier_name: form.supplier_name,
        total_cost: Number(form.total_cost),
        date: new Date(form.date).toISOString(),
        items: [{ quantity: Number(form.quantity) }]
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add import");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-border glass">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Log New Import</h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium mb-1">Supplier Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ring transition-colors"
              value={form.supplier_name}
              onChange={e => setForm({ ...form, supplier_name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Total Cost (PKR)</label>
            <input 
              type="number" 
              required
              min="0"
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ring transition-colors"
              value={form.total_cost}
              onChange={e => setForm({ ...form, total_cost: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Total Quantity</label>
              <input 
                type="number" 
                required
                min="1"
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ring transition-colors"
                value={form.quantity}
                onChange={e => setForm({ ...form, quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input 
                type="date" 
                required
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ring transition-colors"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium hover:bg-accent/10 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-glow flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Import
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
