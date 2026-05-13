import { useState, useEffect } from "react";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { createOrder, fetchCustomers, fetchLaptops } from "@/lib/supabase/realtime-data";
import { formatCurrency } from "@/lib/utils";

export function AddOrderModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [laptops, setLaptops] = useState<any[]>([]);

  const [form, setForm] = useState({
    customer_id: "",
    status: "Pending",
    payment_status: "Unpaid",
    shipping_address: "",
    notes: "",
  });

  const [items, setItems] = useState<any[]>([
    { laptopId: "", quantity: 1, unitPrice: 0, subtotal: 0 }
  ]);

  useEffect(() => {
    fetchCustomers().then(setCustomers).catch(console.error);
    fetchLaptops().then(setLaptops).catch(console.error);
  }, []);

  const addItem = () => {
    setItems([...items, { laptopId: "", quantity: 1, unitPrice: 0, subtotal: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === "laptopId") {
      const laptop = laptops.find(l => l.id === value);
      if (laptop) {
        newItems[index].unitPrice = laptop.sellingPrice;
      }
    }

    newItems[index].subtotal = newItems[index].quantity * newItems[index].unitPrice;
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const total = subtotal; // Simplified

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_id) {
      setError("Please select a customer");
      return;
    }
    if (items.some(item => !item.laptopId)) {
      setError("Please select a laptop for all items");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      await createOrder({
        order_number: orderNumber,
        customer_id: form.customer_id,
        subtotal: subtotal,
        total: total,
        status: form.status,
        payment_status: form.payment_status,
        shipping_address: form.shipping_address || customers.find(c => c.id === form.customer_id)?.address || "N/A",
        notes: form.notes,
        invoice_number: `INV-${orderNumber.split('-')[1]}`,
      }, items);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-border glass my-8">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Create New Order</h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                required
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ring transition-colors"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Order Items</label>
              <button 
                type="button" 
                onClick={addItem}
                className="text-xs flex items-center gap-1 text-primary hover:underline"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end bg-accent/5 p-3 rounded-xl border border-border/50">
                  <div className="col-span-6">
                    <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Laptop</label>
                    <select 
                      required
                      className="w-full bg-input border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                      value={item.laptopId}
                      onChange={e => updateItem(index, "laptopId", e.target.value)}
                    >
                      <option value="">Select laptop...</option>
                      {laptops.map(l => (
                        <option key={l.id} value={l.id}>{l.name} ({l.currentQuantity} in stock)</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Qty</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      className="w-full bg-input border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                      value={item.quantity}
                      onChange={e => updateItem(index, "quantity", Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Price</label>
                    <div className="text-xs font-medium py-1.5">{formatCurrency(item.unitPrice)}</div>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button 
                      type="button" 
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="p-1.5 text-muted-foreground hover:text-destructive disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shipping Address</label>
              <input 
                type="text"
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ring transition-colors"
                value={form.shipping_address}
                onChange={e => setForm({ ...form, shipping_address: e.target.value })}
                placeholder="Leave blank for customer address"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Internal Notes</label>
            <textarea 
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ring transition-colors"
              rows={2}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t border-border mt-6 flex items-center justify-between">
            <div className="text-lg font-bold">
              Total: <span className="text-primary">{formatCurrency(total)}</span>
            </div>
            <div className="flex gap-3">
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
                Create Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
