import { Laptop } from "@/types";
import { Save, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useLaptopStore } from "@/store/laptops";

const blank = (): Laptop => ({
  id: crypto.randomUUID(),
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "", brand: "Lenovo", modelNumber: "", serialNumber: "", sku: "", barcode: "",
  condition: "New",
  processor: { brand: "Intel", category: "Core i5", generation: "12th Gen", modelNumber: "12450H", suffix: "H", displayName: "Intel Core i5 12450H" },
  ram: { type: "DDR4", size: "16GB", brand: "Samsung", slots: 2, upgradeable: true, displayName: "DDR4 16GB" },
  storage: { type: "SSD", size: "512GB", brand: "Samsung", ssdSlots: 1, hddSlots: 0, extraNvmeSlot: false, displayName: "512GB SSD" },
  gpu: { type: "Integrated", brand: "Intel", series: "MX", model: "MX450", memory: "2GB GDDR5", displayName: "Intel MX450" },
  display: { screenSize: "15.6\"", resolution: "FHD", panelType: "IPS", touchType: "Non-Touch", refreshRate: "60Hz", brightness: "300 nits", antiGlare: true, displayName: "15.6\" FHD IPS" },
  battery: { health: 100, backupTime: "8h", cycleCount: 0 },
  charger: { chargerId: crypto.randomUUID(), chargerType: "Type-C", watt: "65W", isOriginal: true, isIncluded: true },
  features: { fingerprintSensor: false, backlitKeyboard: true, webcam: true, hdmiPort: true, usbTypeC: true, lanPort: false, wifi: true, bluetooth: true, keyboardType: "Chiclet", operatingSystem: "Windows 11", warranty: "1 year", notes: "" },
  purchasePrice: 0, sellingPrice: 0, currentQuantity: 0, reorderLevel: 5, location: "Warehouse 1",
  images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"], thumbnail: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
  isActive: true, isFeatured: false,
});

export function LaptopForm({ initial, mode }: { initial?: Laptop; mode: "create" | "edit" }) {
  const [data, setData] = useState<Laptop>(initial ?? blank());
  const navigate = useNavigate();
  const { add, update } = useLaptopStore();

  const setNested = (path: string, v: any) => {
    setData((prev) => {
      const keys = path.split(".");
      if (keys.length === 1) return { ...prev, [path]: v };
      // Handle Date objects correctly by converting back and forth or just avoiding simple JSON clone for Dates
      // Since our state doesn't really have deeply nested dates that change in the form,
      // and createdAt/updatedAt are top-level, a simple spread structure is better than JSON clone
      const newObj = { ...prev };
      let current: any = newObj;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = v;
      return newObj;
    });
  };

  const save = () => {
    if (!data.name.trim() || !data.brand.trim()) { toast.error("Name and brand are required"); return; }
    if (mode === "create") { add(data); toast.success("Laptop added"); }
    else { update(data.id, data); toast.success("Laptop updated"); }
    navigate({ to: "/laptops" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2">
        <button onClick={() => navigate({ to: "/laptops" })} className="inline-flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm hover:bg-accent/10 transition">
          <X className="h-4 w-4" /> Cancel
        </button>
        <button onClick={save} className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-medium shadow-glow hover:opacity-90 transition">
          <Save className="h-4 w-4" /> {mode === "create" ? "Create Laptop" : "Save Changes"}
        </button>
      </div>

      <Section title="Basic Information">
        <Field label="Laptop Name"><Input value={data.name} onChange={(v) => setNested("name", v)} /></Field>
        <Field label="Brand"><Input value={data.brand} onChange={(v) => setNested("brand", v)} /></Field>
        <Field label="Model Number"><Input value={data.modelNumber} onChange={(v) => setNested("modelNumber", v)} /></Field>
        <Field label="Serial Number"><Input value={data.serialNumber} onChange={(v) => setNested("serialNumber", v)} /></Field>
        <Field label="SKU"><Input value={data.sku} onChange={(v) => setNested("sku", v)} /></Field>
        <Field label="Barcode"><Input value={data.barcode} onChange={(v) => setNested("barcode", v)} /></Field>
        <Field label="Condition"><Select value={data.condition} onChange={(v) => setNested("condition", v)} options={["New", "Used", "Refurbished"]} /></Field>
        <Field label="Image URL"><Input value={data.images?.[0] ?? ""} onChange={(v) => setNested("images", [v])} /></Field>
      </Section>

      <Section title="Processor">
        <Field label="Processor Brand"><Select value={data.processor.brand} onChange={(v) => setNested("processor.brand", v)} options={["Intel", "Ryzen"]} /></Field>
        <Field label="Category"><Select value={data.processor.category} onChange={(v) => setNested("processor.category", v)} options={["Core i3","Core i5","Core i7","Core i9","Ryzen 3","Ryzen 5","Ryzen 7","Ryzen 9"]} /></Field>
        <Field label="Generation"><Input value={data.processor.generation} onChange={(v) => setNested("processor.generation", v)} /></Field>
        <Field label="Model Number"><Input value={data.processor.modelNumber} onChange={(v) => setNested("processor.modelNumber", v)} /></Field>
        <Field label="Suffix"><Select value={data.processor.suffix} onChange={(v) => setNested("processor.suffix", v)} options={["U","H","HQ","HX","G","P"]} /></Field>
        <Field label="Display Preview">
          <div className="px-3 py-2.5 rounded-lg bg-input/30 text-sm text-muted-foreground">{data.processor.brand} {data.processor.category} {data.processor.modelNumber}{data.processor.suffix}</div>
        </Field>
      </Section>

      <Section title="RAM">
        <Field label="Type"><Select value={data.ram.type} onChange={(v) => setNested("ram.type", v)} options={["DDR3","DDR4","DDR5"]} /></Field>
        <Field label="Size"><Select value={data.ram.size} onChange={(v) => setNested("ram.size", v)} options={["2GB","4GB","8GB","16GB","32GB","64GB"]} /></Field>
        <Field label="Brand"><Input value={data.ram.brand} onChange={(v) => setNested("ram.brand", v)} /></Field>
        <Field label="Slots"><Input type="number" value={data.ram.slots} onChange={(v) => setNested("ram.slots", Number(v))} /></Field>
        <Field label="Upgradeable"><Toggle value={data.ram.upgradeable} onChange={(v) => setNested("ram.upgradeable", v)} /></Field>
      </Section>

      <Section title="Storage">
        <Field label="Type"><Select value={data.storage.type} onChange={(v) => setNested("storage.type", v)} options={["SSD","HDD","NVMe"]} /></Field>
        <Field label="Size"><Select value={data.storage.size} onChange={(v) => setNested("storage.size", v)} options={["128GB","256GB","512GB","1TB","2TB"]} /></Field>
        <Field label="Brand"><Select value={data.storage.brand} onChange={(v) => setNested("storage.brand", v)} options={["Samsung","Kingston","WD","Crucial","Seagate"]} /></Field>
        <Field label="SSD Slots"><Input type="number" value={data.storage.ssdSlots} onChange={(v) => setNested("storage.ssdSlots", Number(v))} /></Field>
        <Field label="HDD Slots"><Input type="number" value={data.storage.hddSlots} onChange={(v) => setNested("storage.hddSlots", Number(v))} /></Field>
        <Field label="Extra NVMe Slot"><Toggle value={data.storage.extraNvmeSlot} onChange={(v) => setNested("storage.extraNvmeSlot", v)} /></Field>
      </Section>

      <Section title="Graphics">
        <Field label="GPU Type"><Select value={data.gpu.type} onChange={(v) => setNested("gpu.type", v)} options={["Integrated","Dedicated"]} /></Field>
        <Field label="GPU Brand"><Select value={data.gpu.brand} onChange={(v) => setNested("gpu.brand", v)} options={["NVIDIA","AMD","Intel"]} /></Field>
        <Field label="Series"><Select value={data.gpu.series} onChange={(v) => setNested("gpu.series", v)} options={["Quadro","RTX","GTX","MX","Arc","Radeon"]} /></Field>
        <Field label="Model"><Input value={data.gpu.model} onChange={(v) => setNested("gpu.model", v)} /></Field>
        <Field label="Memory"><Input value={data.gpu.memory} onChange={(v) => setNested("gpu.memory", v)} /></Field>
      </Section>

      <Section title="Display">
        <Field label="Screen Size"><Input value={data.display.screenSize} onChange={(v) => setNested("display.screenSize", v)} /></Field>
        <Field label="Resolution"><Select value={data.display.resolution} onChange={(v) => setNested("display.resolution", v)} options={["HD","FHD","QHD","2K","4K"]} /></Field>
        <Field label="Panel"><Select value={data.display.panelType} onChange={(v) => setNested("display.panelType", v)} options={["IPS","OLED","TN"]} /></Field>
        <Field label="Touch"><Select value={data.display.touchType} onChange={(v) => setNested("display.touchType", v)} options={["Touch","Non-Touch"]} /></Field>
        <Field label="Refresh Rate"><Input value={data.display.refreshRate} onChange={(v) => setNested("display.refreshRate", v)} /></Field>
        <Field label="Brightness"><Input value={data.display.brightness} onChange={(v) => setNested("display.brightness", v)} /></Field>
        <Field label="Anti-glare"><Toggle value={data.display.antiGlare} onChange={(v) => setNested("display.antiGlare", v)} /></Field>
      </Section>

      <Section title="Battery">
        <Field label="Health (%)"><Input type="number" value={data.battery.health} onChange={(v) => setNested("battery.health", Number(v))} /></Field>
        <Field label="Backup"><Input value={data.battery.backupTime} onChange={(v) => setNested("battery.backupTime", v)} /></Field>
        <Field label="Cycles"><Input type="number" value={data.battery.cycleCount} onChange={(v) => setNested("battery.cycleCount", Number(v))} /></Field>
      </Section>

      <Section title="Charger">
        <Field label="Type"><Select value={data.charger.chargerType} onChange={(v) => setNested("charger.chargerType", v)} options={["Type-C","Lenovo Pin","Dell Pin","HP Pin","Universal"]} /></Field>
        <Field label="Watt"><Select value={data.charger.watt} onChange={(v) => setNested("charger.watt", v)} options={["45W","65W","90W","120W","180W"]} /></Field>
        <Field label="Original"><Toggle value={data.charger.isOriginal} onChange={(v) => setNested("charger.isOriginal", v)} /></Field>
        <Field label="Included"><Toggle value={data.charger.isIncluded} onChange={(v) => setNested("charger.isIncluded", v)} /></Field>
      </Section>

      <Section title="Connectivity & Features">
        <Field label="Fingerprint"><Toggle value={data.features.fingerprintSensor} onChange={(v) => setNested("features.fingerprintSensor", v)} /></Field>
        <Field label="Backlit Keyboard"><Toggle value={data.features.backlitKeyboard} onChange={(v) => setNested("features.backlitKeyboard", v)} /></Field>
        <Field label="Webcam"><Toggle value={data.features.webcam} onChange={(v) => setNested("features.webcam", v)} /></Field>
        <Field label="HDMI"><Toggle value={data.features.hdmiPort} onChange={(v) => setNested("features.hdmiPort", v)} /></Field>
        <Field label="USB Type-C"><Toggle value={data.features.usbTypeC} onChange={(v) => setNested("features.usbTypeC", v)} /></Field>
        <Field label="LAN"><Toggle value={data.features.lanPort} onChange={(v) => setNested("features.lanPort", v)} /></Field>
        <Field label="WiFi"><Toggle value={data.features.wifi} onChange={(v) => setNested("features.wifi", v)} /></Field>
        <Field label="Bluetooth"><Toggle value={data.features.bluetooth} onChange={(v) => setNested("features.bluetooth", v)} /></Field>
        <Field label="Keyboard Type"><Input value={data.features.keyboardType} onChange={(v) => setNested("features.keyboardType", v)} /></Field>
        <Field label="OS"><Input value={data.features.operatingSystem} onChange={(v) => setNested("features.operatingSystem", v)} /></Field>
        <Field label="Warranty"><Input value={data.features.warranty} onChange={(v) => setNested("features.warranty", v)} /></Field>
      </Section>

      <Section title="Pricing & Stock">
        <Field label="Purchase Price (Rs.)"><Input type="number" value={data.purchasePrice} onChange={(v) => setNested("purchasePrice", Number(v) || 0)} /></Field>
        <Field label="Sale Price (Rs.)"><Input type="number" value={data.sellingPrice} onChange={(v) => setNested("sellingPrice", Number(v) || 0)} /></Field>
        <Field label="Stock Quantity"><Input type="number" value={data.currentQuantity} onChange={(v) => setNested("currentQuantity", Number(v) || 0)} /></Field>
      </Section>

      <Section title="Notes" cols={1}>
        <Field label="Notes" full>
          <textarea value={data.features.notes} onChange={(e) => setNested("features.notes", e.target.value)} rows={3} className="w-full bg-input/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60" />
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
function Input({ value, onChange, type = "text" }: { value: any; onChange: (v: string) => void; type?: string }) {
  return <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full bg-input/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60" />;
}
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-input/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60">
      {options.map((o) => <option key={o} value={o} className="bg-popover">{o}</option>)}
    </select>
  );
}
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)} className={`w-12 h-7 rounded-full relative transition ${value ? "bg-gradient-primary" : "bg-input/60"}`}>
      <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-background transition ${value ? "translate-x-5" : ""}`} />
    </button>
  );
}

