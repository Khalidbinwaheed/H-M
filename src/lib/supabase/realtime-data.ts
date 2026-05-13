import { createClient } from "./client";

const supabase = createClient();

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200";

const toDate = (value: string | null | undefined) => (value ? new Date(value) : new Date());

export function mapLaptop(row: any) {
  const processor = row.processor ?? {};
  const ram = row.ram ?? {};
  const storage = row.storage ?? {};
  const gpu = row.gpu ?? {};
  const display = row.display ?? {};
  const battery = row.battery ?? { health: 100, backupTime: "", cycleCount: 0 };
  const charger = row.charger ?? {};
  const features = row.features ?? {};

  const mapped = {
    id: row.id,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
    name: row.name ?? "",
    brand: row.brand ?? "",
    modelNumber: row.model_number ?? "",
    serialNumber: row.serial_number ?? "",
    sku: row.sku ?? "",
    barcode: row.barcode ?? "",
    condition: row.condition ?? "New",
    processor,
    ram,
    storage,
    gpu,
    display,
    battery,
    charger,
    features,
    purchasePrice: Number(row.purchase_price ?? 0),
    sellingPrice: Number(row.selling_price ?? 0),
    currentQuantity: Number(row.current_quantity ?? 0),
    reorderLevel: Number(row.reorder_level ?? 5),
    location: row.location ?? "",
    images: Array.isArray(row.images) ? row.images : [],
    thumbnail: row.thumbnail ?? FALLBACK_IMAGE,
    isActive: row.is_active ?? true,
    isFeatured: row.is_featured ?? false,

    // Backward-compatible aliases used by route/forms.
    processorBrand: processor.brand ?? "Intel",
    processorCategory: processor.category ?? "Core i5",
    processorGeneration: processor.generation ?? "12th Gen",
    processorModel: processor.modelNumber ?? "",
    processorSuffix: processor.suffix ?? "H",
    ramType: ram.type ?? "DDR4",
    ramSize: ram.size ?? "16GB",
    ramBrand: ram.brand ?? "",
    ramSlots: Number(ram.slots ?? 2),
    ramUpgradeable: ram.upgradeable ?? true,
    storageType: storage.type ?? "SSD",
    storageSize: storage.size ?? "512GB",
    storageBrand: storage.brand ?? "Samsung",
    ssdSlots: Number(storage.ssdSlots ?? 1),
    hddSlots: Number(storage.hddSlots ?? 0),
    extraNvme: storage.extraNvmeSlot ?? false,
    gpuType: gpu.type ?? "Integrated",
    gpuBrand: gpu.brand ?? "Intel",
    gpuSeries: gpu.series ?? "Arc",
    gpuModel: gpu.model ?? "",
    gpuMemory: gpu.memory ?? "",
    screenSize: display.screenSize ?? "15.6\"",
    resolution: display.resolution ?? "FHD",
    panelType: display.panelType ?? "IPS",
    touch: (display.touchType ?? "Non-Touch") === "Touch",
    refreshRate: Number(String(display.refreshRate ?? "60").replace(/[^0-9]/g, "") || 60),
    brightness: Number(String(display.brightness ?? "300").replace(/[^0-9]/g, "") || 300),
    antiGlare: display.antiGlare ?? true,
    batteryHealth: Number(battery.health ?? 100),
    batteryBackup: battery.backupTime ?? "",
    batteryCycles: Number(battery.cycleCount ?? 0),
    chargerType: charger.chargerType ?? "Type-C",
    chargerWatt: charger.watt ?? "65W",
    originalCharger: charger.isOriginal ?? true,
    chargerIncluded: charger.isIncluded ?? true,
    fingerprint: features.fingerprintSensor ?? false,
    backlitKeyboard: features.backlitKeyboard ?? true,
    webcam: features.webcam ?? true,
    hdmi: features.hdmiPort ?? true,
    usbTypeC: features.usbTypeC ?? true,
    lan: features.lanPort ?? false,
    wifi: features.wifi ? "WiFi" : "",
    bluetooth: features.bluetooth ? "Bluetooth" : "",
    keyboardType: features.keyboardType ?? "",
    os: features.operatingSystem ?? "",
    warranty: features.warranty ?? "",
    notes: features.notes ?? "",
    costPrice: Number(row.purchase_price ?? 0),
    salePrice: Number(row.selling_price ?? 0),
    stock: Number(row.current_quantity ?? 0),
    imageUrl: row.thumbnail ?? FALLBACK_IMAGE,
  };

  return mapped;
}

export function laptopToRow(laptop: any) {
  return {
    name: laptop.name,
    brand: laptop.brand,
    model_number: laptop.modelNumber ?? "",
    serial_number: laptop.serialNumber ?? "",
    sku: laptop.sku,
    barcode: laptop.barcode ?? "",
    condition: laptop.condition ?? "New",
    processor: laptop.processor ?? {
      brand: laptop.processorBrand,
      category: laptop.processorCategory,
      generation: laptop.processorGeneration,
      modelNumber: laptop.processorModel,
      suffix: laptop.processorSuffix,
      displayName: `${laptop.processorBrand ?? ""} ${laptop.processorCategory ?? ""} ${laptop.processorModel ?? ""}${laptop.processorSuffix ?? ""}`.trim(),
    },
    ram: laptop.ram ?? {
      type: laptop.ramType,
      size: laptop.ramSize,
      brand: laptop.ramBrand,
      slots: laptop.ramSlots,
      upgradeable: laptop.ramUpgradeable,
      displayName: `${laptop.ramType ?? ""} ${laptop.ramSize ?? ""}`.trim(),
    },
    storage: laptop.storage ?? {
      type: laptop.storageType,
      size: laptop.storageSize,
      brand: laptop.storageBrand,
      ssdSlots: laptop.ssdSlots,
      hddSlots: laptop.hddSlots,
      extraNvmeSlot: laptop.extraNvme,
      displayName: `${laptop.storageSize ?? ""} ${laptop.storageType ?? ""}`.trim(),
    },
    gpu: laptop.gpu ?? {
      type: laptop.gpuType,
      brand: laptop.gpuBrand,
      series: laptop.gpuSeries,
      model: laptop.gpuModel,
      memory: laptop.gpuMemory,
      displayName: `${laptop.gpuBrand ?? ""} ${laptop.gpuSeries ?? ""} ${laptop.gpuModel ?? ""}`.trim(),
    },
    display: laptop.display ?? {
      screenSize: laptop.screenSize,
      resolution: laptop.resolution,
      panelType: laptop.panelType,
      touchType: laptop.touch ? "Touch" : "Non-Touch",
      refreshRate: `${laptop.refreshRate ?? 60}Hz`,
      brightness: `${laptop.brightness ?? 300} nits`,
      antiGlare: laptop.antiGlare,
      displayName: `${laptop.screenSize ?? ""} ${laptop.resolution ?? ""}`.trim(),
    },
    battery: laptop.battery ?? {
      health: laptop.batteryHealth,
      backupTime: laptop.batteryBackup,
      cycleCount: laptop.batteryCycles,
    },
    charger: laptop.charger ?? {
      chargerId: laptop.chargerId ?? null,
      chargerType: laptop.chargerType,
      watt: laptop.chargerWatt,
      isOriginal: laptop.originalCharger,
      isIncluded: laptop.chargerIncluded,
    },
    features: laptop.features ?? {
      fingerprintSensor: laptop.fingerprint,
      backlitKeyboard: laptop.backlitKeyboard,
      webcam: laptop.webcam,
      hdmiPort: laptop.hdmi,
      usbTypeC: laptop.usbTypeC,
      lanPort: laptop.lan,
      wifi: !!laptop.wifi,
      bluetooth: !!laptop.bluetooth,
      keyboardType: laptop.keyboardType,
      operatingSystem: laptop.os,
      warranty: laptop.warranty,
      notes: laptop.notes,
    },
    purchase_price: Number(laptop.purchasePrice ?? laptop.costPrice ?? 0),
    selling_price: Number(laptop.sellingPrice ?? laptop.salePrice ?? 0),
    current_quantity: Number(laptop.currentQuantity ?? laptop.stock ?? 0),
    reorder_level: Number(laptop.reorderLevel ?? 5),
    location: laptop.location ?? "",
    images: Array.isArray(laptop.images) ? laptop.images : [],
    thumbnail: laptop.thumbnail ?? laptop.imageUrl ?? FALLBACK_IMAGE,
    is_active: laptop.isActive ?? true,
    is_featured: laptop.isFeatured ?? false,
  };
}

export function mapCharger(row: any) {
  return {
    id: row.id,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
    brand: row.brand ?? "",
    type: row.type,
    watt: row.watt,
    compatibleBrands: row.compatible_brands ?? [],
    isOriginal: row.is_original ?? true,
    quantity: Number(row.quantity ?? 0),
    purchasePrice: Number(row.purchase_price ?? 0),
    salePrice: Number(row.sale_price ?? 0),
    stockStatus: row.stock_status ?? "In Stock",
    reorderLevel: Number(row.reorder_level ?? 10),
    location: row.location ?? "",
    image: row.image ?? FALLBACK_IMAGE,
    isActive: row.is_active ?? true,

    pinType: row.type,
    wattage: row.watt,
    stock: Number(row.quantity ?? 0),
    original: row.is_original ?? true,
    costPrice: Number(row.purchase_price ?? 0),
    imageUrl: row.image ?? FALLBACK_IMAGE,
    sku: `${(row.brand ?? "CHG").toUpperCase().slice(0, 3)}-${String(row.id).slice(0, 6)}`,
    name: `${row.brand ?? ""} ${row.type ?? ""} ${row.watt ?? ""}`.trim(),
    condition: "New",
  };
}

export function chargerToRow(charger: any) {
  const qty = Number(charger.quantity ?? charger.stock ?? 0);
  const reorder = Number(charger.reorderLevel ?? 10);
  const stockStatus = qty === 0 ? "Out of Stock" : qty <= reorder ? "Low Stock" : "In Stock";
  return {
    brand: charger.brand,
    type: charger.type ?? charger.pinType,
    watt: charger.watt ?? charger.wattage,
    compatible_brands: charger.compatibleBrands ?? charger.compatibility ?? [],
    is_original: charger.isOriginal ?? charger.original ?? true,
    quantity: qty,
    purchase_price: Number(charger.purchasePrice ?? charger.costPrice ?? 0),
    sale_price: Number(charger.salePrice ?? 0),
    stock_status: stockStatus,
    reorder_level: reorder,
    location: charger.location ?? "",
    image: charger.image ?? charger.imageUrl ?? FALLBACK_IMAGE,
    is_active: charger.isActive ?? true,
  };
}

export function mapCustomer(row: any) {
  return {
    id: row.id,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
    name: row.name ?? "",
    type: row.type ?? "B2C",
    phone: row.phone ?? "",
    whatsapp: row.whatsapp ?? "",
    email: row.email ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    postalCode: row.postal_code ?? "",
    country: row.country ?? "",
    companyName: row.company_name ?? "",
    taxNumber: row.tax_number ?? "",
    taxId: row.tax_id ?? "",
    creditLimit: Number(row.credit_limit ?? 0),
    paymentTerms: row.payment_terms ?? "",
    totalPurchases: Number(row.total_purchases ?? 0),
    totalAmount: Number(row.total_amount ?? 0),
    outstandingBalance: Number(row.outstanding_balance ?? 0),
    lastPurchaseDate: row.last_purchase_date ? new Date(row.last_purchase_date) : undefined,
    isActive: row.is_active ?? true,
    notes: row.notes ?? "",
    profileImage: row.profile_image ?? undefined,

    company: row.company_name ?? "",
    status: row.is_active ? "Active" : "Inactive",
    totalOrders: Number(row.total_purchases ?? 0),
    totalSpent: Number(row.total_amount ?? 0),
    avatarColor: "from-primary to-accent",
    lastOrderAt: row.last_purchase_date,
  };
}

export function customerToRow(customer: any) {
  return {
    name: customer.name,
    type: customer.type,
    phone: customer.phone,
    whatsapp: customer.whatsapp ?? "",
    email: customer.email,
    address: customer.address ?? "",
    city: customer.city ?? "",
    state: customer.state ?? customer.city ?? "",
    postal_code: customer.postalCode ?? "",
    country: customer.country ?? "Pakistan",
    company_name: customer.companyName ?? customer.company ?? "",
    tax_number: customer.taxNumber ?? "",
    tax_id: customer.taxId ?? "",
    credit_limit: Number(customer.creditLimit ?? 0),
    payment_terms: customer.paymentTerms ?? "",
    total_purchases: Number(customer.totalPurchases ?? customer.totalOrders ?? 0),
    total_amount: Number(customer.totalAmount ?? customer.totalSpent ?? 0),
    outstanding_balance: Number(customer.outstandingBalance ?? 0),
    last_purchase_date: customer.lastPurchaseDate ?? customer.lastOrderAt ?? null,
    is_active: (customer.status ? customer.status !== "Inactive" && customer.status !== "Blocked" : true) && customer.isActive !== false,
    notes: customer.notes ?? "",
    profile_image: customer.profileImage ?? "",
  };
}

export function mapOrder(row: any, items: any[]) {
  const orderItems = (items ?? []).map((item: any) => ({
    laptopId: item.laptop_id,
    quantity: Number(item.quantity ?? 0),
    unitPrice: Number(item.unit_price ?? 0),
    subtotal: Number(item.subtotal ?? 0),
    discount: Number(item.discount ?? 0),
  }));

  return {
    id: row.id,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
    orderNumber: row.order_number,
    customerId: row.customer_id,
    items: orderItems,
    subtotal: Number(row.subtotal ?? 0),
    tax: Number(row.tax ?? 0),
    taxRate: Number(row.tax_rate ?? 0),
    discount: Number(row.discount ?? 0),
    shippingCost: Number(row.shipping_cost ?? 0),
    total: Number(row.total ?? 0),
    status: row.status,
    paymentStatus: row.payment_status,
    shippingAddress: row.shipping_address ?? "",
    deliveryDate: row.delivery_date ? new Date(row.delivery_date) : undefined,
    paymentMethod: row.payment_method ?? "",
    paymentNotes: row.payment_notes ?? "",
    notes: row.notes ?? "",
    invoiceNumber: row.invoice_number ?? "",
    invoiceUrl: row.invoice_url ?? undefined,
  };
}

export async function fetchLaptops() {
  const { data, error } = await supabase.from("laptops").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapLaptop);
}

export async function fetchChargers() {
  const { data, error } = await supabase.from("chargers").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapCharger);
}

export async function fetchCustomers() {
  const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapCustomer);
}

export async function fetchOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row: any) => mapOrder(row, row.order_items));
}

export async function fetchInventoryImports() {
  const { data, error } = await supabase.from("inventory_imports").select("*").order("date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchInventoryExports() {
  const { data, error } = await supabase
    .from("inventory_exports")
    .select("*, customers(name, city, country)")
    .order("date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createInventoryImport(payload: any) {
  const { data, error } = await supabase.from("inventory_imports").insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function createInventoryExport(payload: any) {
  const { data, error } = await supabase.from("inventory_exports").insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function createOrder(orderPayload: any, items: any[]) {
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert(orderPayload)
    .select("*")
    .single();

  if (orderError) throw orderError;

  const orderItems = items.map(item => ({
    order_id: orderData.id,
    laptop_id: item.laptopId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    subtotal: item.subtotal,
    discount: item.discount || 0
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw itemsError;

  return mapOrder(orderData, orderItems);
}

export async function createLaptop(laptop: any) {
  const row = laptopToRow(laptop);
  const { data, error } = await supabase.from("laptops").insert(row).select("*").single();
  if (error) throw error;
  return mapLaptop(data);
}

export async function updateLaptop(id: string, patch: any) {
  const row = laptopToRow(patch);
  const { data, error } = await supabase.from("laptops").update(row).eq("id", id).select("*").single();
  if (error) throw error;
  return mapLaptop(data);
}

export async function deleteLaptop(id: string) {
  const { error } = await supabase.from("laptops").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteManyLaptops(ids: string[]) {
  const { error } = await supabase.from("laptops").delete().in("id", ids);
  if (error) throw error;
}

export async function createCharger(charger: any) {
  const row = chargerToRow(charger);
  const { data, error } = await supabase.from("chargers").insert(row).select("*").single();
  if (error) throw error;
  return mapCharger(data);
}

export async function updateCharger(id: string, patch: any) {
  const row = chargerToRow(patch);
  const { data, error } = await supabase.from("chargers").update(row).eq("id", id).select("*").single();
  if (error) throw error;
  return mapCharger(data);
}

export async function deleteCharger(id: string) {
  const { error } = await supabase.from("chargers").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteManyChargers(ids: string[]) {
  const { error } = await supabase.from("chargers").delete().in("id", ids);
  if (error) throw error;
}

export async function createCustomer(customer: any) {
  const row = customerToRow(customer);
  const { data, error } = await supabase.from("customers").insert(row).select("*").single();
  if (error) throw error;
  return mapCustomer(data);
}

export async function updateCustomer(id: string, patch: any) {
  const row = customerToRow(patch);
  const { data, error } = await supabase.from("customers").update(row).eq("id", id).select("*").single();
  if (error) throw error;
  return mapCustomer(data);
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteManyCustomers(ids: string[]) {
  const { error } = await supabase.from("customers").delete().in("id", ids);
  if (error) throw error;
}

export function subscribeTable(table: string, onChange: () => void) {
  const channel = supabase
    .channel(`public:${table}:${Math.random().toString(36).slice(2)}`)
    .on("postgres_changes", { event: "*", schema: "public", table }, onChange)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
