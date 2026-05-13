import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { createInventoryExport, fetchCustomers } from "@/lib/supabase/realtime-data";

export function AddExportModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);

  const [form, setForm] = useState({
    customer_id: "",
    total_revenue: "",
    date: new Date().toISOString().split("T")[0],
    quantity: "1",
    delivery_status: "Pending",
    payment_status: "Unpaid",
  });

  useEffect(() => {
    fetchCustomers().then(setCustomers).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_id) {
      setError("Please select a customer");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await createInventoryExport({
        customer_id: form.customer_id,
        total_revenue: Number(form.total_revenue),
        delivery_status: form.delivery_status,
        payment_status: form.payment_status,
        date: new Date(form.date).toISOString(),
        items: [{ quantity: Number(form.quantity) }]
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add export");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-border glass">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Log New Export</h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium mb-1">Customer</label>
            <select 
              required
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ring transition-colors"
              value={form.customer_id}
              onChange={e => setForm({ ...form, customer_id: e.target.value })}
            >
              <option value="">Select a customer...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Total Revenue (Rs.)</label>
            <input 
              type="number" 
              required
              min="0"
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ring transition-colors"
              value={form.total_revenue}
              onChange={e => setForm({ ...form, total_revenue: e.target.value })}
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

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select 
              required
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ring transition-colors"
              value={form.delivery_status}
              onChange={e => setForm({ ...form, delivery_status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Status</label>
            <select 
              required
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ring transition-colors"
              value={form.payment_status}
              onChange={e => setForm({ ...form, payment_status: e.target.value })}
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Partial">Partial</option>
              <option value="Paid">Paid</option>
              <option value="Refunded">Refunded</option>
            </select>
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
              Save Export
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
