import { Order, Customer, Laptop } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Printer, X } from "lucide-react";
import { useEffect } from "react";

interface InvoiceModalProps {
  order: Order;
  customer?: Customer;
  laptops: Laptop[];
  onClose: () => void;
}

export function InvoiceModal({ order, customer, laptops, onClose }: InvoiceModalProps) {
  useEffect(() => {
    // Add a class to body to help with print styles
    document.body.classList.add("printing-invoice");
    return () => document.body.classList.remove("printing-invoice");
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 invoice-modal-container">
      <div className="bg-white text-black w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] invoice-modal-inner">
        
        {/* Header Actions - Hidden when printing */}
        <div className="flex items-center justify-between p-4 border-b border-border print:hidden bg-background">
          <h2 className="text-lg font-semibold text-foreground">Invoice Preview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-glow"
            >
              <Printer className="w-4 h-4" />
              Print Invoice
            </button>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-12 overflow-y-auto print:overflow-visible print:p-8 font-sans bg-white relative">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-5xl font-display font-bold text-[#1a2b4c] mb-6 uppercase tracking-wider">
                {customer?.type === "B2B" ? "TAX INVOICE" : "INVOICE"}
              </h1>
              <div className="text-sm text-gray-800 leading-relaxed font-medium">
                <p>H&M Trads Inc.</p>
                <p>Hall Road, Lahore</p>
                <p>Punjab, Pakistan 54000</p>
              </div>
            </div>
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-400 text-white font-bold text-2xl tracking-tighter shadow-sm">
              H&M
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8 mb-8 text-sm">
            <div className="col-span-4">
              <h4 className="text-[#1a2b4c] font-bold uppercase tracking-wider mb-2">Bill To</h4>
              {customer ? (
                <div className="text-gray-800 leading-relaxed">
                  <p className="font-semibold">{customer.name}</p>
                  {customer.companyName && <p>{customer.companyName}</p>}
                  <p>{customer.address}</p>
                  <p>{customer.city}</p>
                  {customer.type === "B2B" && (customer.taxNumber || customer.taxId) && (
                    <p className="mt-1">Tax ID: {customer.taxNumber || customer.taxId}</p>
                  )}
                </div>
              ) : (
                <p className="italic text-gray-500">Walk-in Customer</p>
              )}
            </div>
            
            <div className="col-span-4">
              <h4 className="text-[#1a2b4c] font-bold uppercase tracking-wider mb-2">Ship To</h4>
              {customer ? (
                <div className="text-gray-800 leading-relaxed">
                  <p className="font-semibold">{customer.name}</p>
                  <p>{order.shippingAddress || customer.address}</p>
                  <p>{customer.city}</p>
                </div>
              ) : (
                <p className="italic text-gray-500">Walk-in Customer</p>
              )}
            </div>

            <div className="col-span-4">
              <div className="grid grid-cols-2 gap-y-3 text-gray-800 items-center">
                <div className="font-bold text-[#1a2b4c] uppercase">Invoice #</div>
                <div className="text-right">{order.invoiceNumber || order.orderNumber}</div>
                
                <div className="font-bold text-[#1a2b4c] uppercase">Invoice Date</div>
                <div className="text-right">{formatDate(order.createdAt)}</div>
                
                <div className="font-bold text-[#1a2b4c] uppercase">P.O.#</div>
                <div className="text-right">{order.paymentNotes || "N/A"}</div>
                
                <div className="font-bold text-[#1a2b4c] uppercase">Due Date</div>
                <div className="text-right">{order.deliveryDate ? formatDate(order.deliveryDate) : formatDate(order.createdAt)}</div>
              </div>
            </div>
          </div>

          <table className="w-full mb-8 text-sm">
            <thead>
              <tr className="border-y-2 border-[#e74c3c]">
                <th className="text-center py-3 font-bold text-[#1a2b4c] uppercase w-16">Qty</th>
                <th className="text-left py-3 font-bold text-[#1a2b4c] uppercase">Description</th>
                <th className="text-right py-3 font-bold text-[#1a2b4c] uppercase w-32">Unit Price</th>
                <th className="text-right py-3 font-bold text-[#1a2b4c] uppercase w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => {
                const laptop = laptops.find(l => l.id === item.laptopId);
                return (
                  <tr key={idx} className="border-b border-transparent">
                    <td className="text-center py-4 text-gray-800">{item.quantity}</td>
                    <td className="py-4">
                      <p className="font-medium text-gray-800">{laptop ? laptop.name : "Custom Item"}</p>
                    </td>
                    <td className="text-right py-4 text-gray-800">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right py-4 text-gray-800">{formatCurrency(item.subtotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="w-full border-t border-[#e74c3c]"></div>

          <div className="flex justify-end mt-6 mb-16">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm text-gray-800">
                <span className="font-medium">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-gray-800">
                  <span className="font-medium">Discount</span>
                  <span className="text-red-600">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-sm text-gray-800">
                  <span className="font-medium">Sales Tax {(order.taxRate * 100).toFixed(2)}%</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className="text-[#1a2b4c] font-bold text-lg uppercase tracking-wider">Total</span>
                <span className="text-[#1a2b4c] font-bold text-xl">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end print:mt-16 relative">
            <div className="text-center pr-8">
              <div className="w-48 border-b-2 border-black mb-2 relative">
                <span className="absolute -top-8 left-6 text-4xl text-black" style={{ fontFamily: "'Brush Script MT', cursive", transform: "rotate(-5deg)" }}>H&M Trads</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
