import {
  Laptop,
  Charger,
  Customer,
  Order,
  InventoryImport,
  InventoryExport,
  User,
  DailySalesMetrics,
  TopSellingProduct,
} from "@/types";

// ==================== HELPERS ====================

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems<T>(arr: T[], min: number, max: number): T[] {
  const count = randomBetween(min, max);
  const result: T[] = [];
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateId(): string {
  return crypto.randomUUID();
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// ==================== LAPTOP GENERATOR ====================

const laptopBrands = ["Dell", "HP", "Lenovo", "ASUS", "Apple", "Acer", "MSI", "Razer"];
const processorModels = [
  { brand: "Intel" as const, category: "Core i3" as const, model: "8100", suffix: "U" as const, gen: "8th Gen" as const },
  { brand: "Intel" as const, category: "Core i5" as const, model: "11400", suffix: "H" as const, gen: "11th Gen" as const },
  { brand: "Intel" as const, category: "Core i7" as const, model: "12700", suffix: "H" as const, gen: "12th Gen" as const },
  { brand: "Intel" as const, category: "Core i9" as const, model: "13900HX", suffix: "HX" as const, gen: "13th Gen" as const },
  { brand: "Ryzen" as const, category: "Ryzen 5" as const, model: "5500U", suffix: "U" as const, gen: "10th Gen" as const },
  { brand: "Ryzen" as const, category: "Ryzen 7" as const, model: "5800H", suffix: "H" as const, gen: "10th Gen" as const },
];

const gpuModels = [
  { brand: "NVIDIA" as const, series: "RTX" as const, model: "4060", memory: "6GB GDDR6" },
  { brand: "NVIDIA" as const, series: "RTX" as const, model: "4070", memory: "8GB GDDR6" },
  { brand: "NVIDIA" as const, series: "MX" as const, model: "550", memory: "2GB GDDR5" },
  { brand: "AMD" as const, series: "Radeon" as const, model: "RX 6600M", memory: "8GB GDDR6" },
  { brand: "Intel" as const, series: "Arc" as const, model: "A770", memory: "8GB GDDR6" },
];

const displaySpecs = [
  { size: "13.3\"", resolution: "FHD" as const, panel: "IPS" as const, refresh: "60Hz" },
  { size: "15.6\"", resolution: "FHD" as const, panel: "IPS" as const, refresh: "60Hz" },
  { size: "15.6\"", resolution: "4K" as const, panel: "OLED" as const, refresh: "120Hz" },
  { size: "17.3\"", resolution: "QHD" as const, panel: "IPS" as const, refresh: "165Hz" },
];

export function generateLaptop(): Laptop {
  const brand = randomItem(laptopBrands);
  const processor = randomItem(processorModels);
  const gpu = randomItem(gpuModels);
  const display = randomItem(displaySpecs);
  const ramSize = randomItem(["8GB", "16GB", "32GB"] as const);
  const storageSize = randomItem(["512GB", "1TB", "2TB"] as const);

  return {
    id: generateId(),
    createdAt: randomDate(new Date(2023, 0, 1), new Date()),
    updatedAt: randomDate(new Date(2024, 0, 1), new Date()),

    name: `${brand} ${processor.category} Laptop`,
    brand,
    modelNumber: `${brand.substring(0, 2).toUpperCase()}${randomBetween(1000, 9999)}`,
    serialNumber: `SN${randomBetween(100000, 999999)}`,
    sku: `SKU${randomBetween(10000, 99999)}`,
    barcode: `${randomBetween(1000000000000, 9999999999999)}`,
    condition: randomItem(["New", "Used", "Refurbished"] as const),

    processor: {
      brand: processor.brand,
      category: processor.category,
      generation: processor.gen,
      modelNumber: processor.model,
      suffix: processor.suffix,
      displayName: `${processor.brand} ${processor.category} ${processor.model}${processor.suffix}`,
    },

    ram: {
      type: randomItem(["DDR4", "DDR5"] as const),
      size: ramSize,
      brand: randomItem(["Corsair", "Kingston", "Crucial", "G.Skill"]),
      slots: randomItem([1, 2, 4]),
      upgradeable: randomItem([true, false]),
      displayName: `${ramSize} DDR5`,
    },

    storage: {
      type: "SSD" as const,
      size: storageSize,
      brand: randomItem(["Samsung", "Kingston", "WD", "Crucial"] as const),
      ssdSlots: randomBetween(1, 2),
      hddSlots: 0,
      extraNvmeSlot: randomItem([true, false]),
      displayName: `${storageSize} SSD`,
    },

    gpu: {
      type: gpu.brand === "Intel" ? ("Integrated" as const) : ("Dedicated" as const),
      brand: gpu.brand,
      series: gpu.series,
      model: gpu.model,
      memory: gpu.memory,
      displayName: `${gpu.brand} ${gpu.series} ${gpu.model} ${gpu.memory}`,
    },

    display: {
      screenSize: display.size,
      resolution: display.resolution,
      panelType: display.panel,
      touchType: randomItem(["Touch", "Non-Touch"] as const),
      refreshRate: display.refresh,
      brightness: `${randomBetween(250, 500)} nits`,
      antiGlare: randomItem([true, false]),
      displayName: `${display.size} ${display.resolution} ${display.panel} ${display.refresh}`,
    },

    battery: {
      health: randomBetween(80, 100),
      backupTime: `${randomBetween(4, 12)} hours`,
      cycleCount: randomBetween(0, 500),
    },

    charger: {
      chargerId: generateId(),
      chargerType: randomItem(["Type-C", "Lenovo Pin", "Dell Pin", "HP Pin", "Universal"] as const),
      watt: randomItem(["45W", "65W", "90W", "120W"] as const),
      isOriginal: randomItem([true, false]),
      isIncluded: true,
    },

    features: {
      fingerprintSensor: randomItem([true, false]),
      backlitKeyboard: randomItem([true, false]),
      webcam: true,
      hdmiPort: randomItem([true, false]),
      usbTypeC: true,
      lanPort: randomItem([true, false]),
      wifi: true,
      bluetooth: true,
      keyboardType: randomItem(["Chiclet", "Mechanical", "Scissor"]),
      operatingSystem: randomItem(["Windows 11 Pro", "Windows 11 Home", "Ubuntu 22.04", "macOS Ventura"]),
      warranty: randomItem(["1 Year", "2 Years", "3 Years"]),
      notes: "Excellent condition, original box included",
    },

    purchasePrice: randomBetween(40000, 150000),
    sellingPrice: randomBetween(50000, 180000),
    currentQuantity: randomBetween(1, 20),
    reorderLevel: 5,
    location: randomItem(["Shelf A1", "Shelf B2", "Shelf C3", "Warehouse 1"]),

    images: [
      `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400`,
      `https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=400`,
    ],
    thumbnail: `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200`,

    isActive: true,
    isFeatured: randomItem([true, false, false]),
  };
}

export function seedLaptops(count: number): Laptop[] {
  return Array.from({ length: count }, () => generateLaptop());
}

// ==================== CHARGER GENERATOR ====================

const chargerBrands = ["Dell", "HP", "Lenovo", "ASUS", "Apple", "Corsair", "Anker", "Belkin"];

export function generateCharger(): Charger {
  return {
    id: generateId(),
    createdAt: randomDate(new Date(2023, 0, 1), new Date()),
    updatedAt: randomDate(new Date(2024, 0, 1), new Date()),

    brand: randomItem(chargerBrands),
    type: randomItem(["Type-C", "Lenovo Pin", "Dell Pin", "HP Pin", "Universal"] as const),
    watt: randomItem(["45W", "65W", "90W", "120W", "180W"] as const),
    compatibleBrands: randomItems(laptopBrands, 2, 5),
    isOriginal: randomItem([true, false]),

    quantity: randomBetween(5, 50),
    purchasePrice: randomBetween(1000, 3000),
    salePrice: randomBetween(1500, 4000),
    stockStatus: randomItem(["In Stock", "Low Stock", "Out of Stock"] as const),
    reorderLevel: 10,
    location: randomItem(["Shelf A1", "Shelf B2", "Shelf C3"]),

    image: `https://images.unsplash.com/photo-1625948515291-69613efd103f?w=200&h=200`,

    isActive: true,
  };
}

export function seedChargers(count: number): Charger[] {
  return Array.from({ length: count }, () => generateCharger());
}

// ==================== CUSTOMER GENERATOR ====================

const firstNames = ["John", "Jane", "Michael", "Sarah", "Robert", "Emma", "David", "Lisa", "James", "Mary"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
const companies = ["Tech Solutions Inc", "Digital Ventures Ltd", "IT Consulting Group", "Software Hub", "Enterprise Systems"];
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
const states = ["NY", "CA", "IL", "TX", "AZ"];

export function generateCustomer(type: "B2B" | "B2C" = randomItem(["B2B", "B2C"] as const)): Customer {
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

  return {
    id: generateId(),
    createdAt: randomDate(new Date(2023, 0, 1), new Date()),
    updatedAt: randomDate(new Date(2024, 0, 1), new Date()),

    name: `${firstName} ${lastName}`,
    type,

    phone: `+1${randomBetween(2000000000, 9999999999)}`,
    whatsapp: `+1${randomBetween(2000000000, 9999999999)}`,
    email,
    address: `${randomBetween(100, 9999)} ${randomItem(["Main", "Oak", "Elm", "Pine"])} Street`,
    city: randomItem(cities),
    state: randomItem(states),
    postalCode: `${randomBetween(10000, 99999)}`,
    country: "USA",

    companyName: type === "B2B" ? randomItem(companies) : undefined,
    taxNumber: type === "B2B" ? `TAX${randomBetween(100000, 999999)}` : undefined,
    creditLimit: type === "B2B" ? randomBetween(500000, 5000000) : undefined,
    paymentTerms: type === "B2B" ? randomItem(["Net 15", "Net 30", "Net 45"]) : undefined,

    totalPurchases: randomBetween(1, 50),
    totalAmount: randomBetween(50000, 5000000),
    outstandingBalance: randomBetween(0, 500000),
    lastPurchaseDate: randomDate(new Date(2024, 0, 1), new Date()),

    isActive: true,
    notes: "Good customer, reliable payments",
  };
}

export function seedCustomers(b2bCount: number, b2cCount: number): Customer[] {
  const b2b = Array.from({ length: b2bCount }, () => generateCustomer("B2B"));
  const b2c = Array.from({ length: b2cCount }, () => generateCustomer("B2C"));
  return [...b2b, ...b2c];
}

// ==================== ORDER GENERATOR ====================

export function generateOrder(laptops: Laptop[], customers: Customer[]): Order {
  const customer = randomItem(customers);
  const orderLaptops = randomItems(laptops, 1, 3);

  const items = orderLaptops.map((laptop) => ({
    laptopId: laptop.id,
    quantity: randomBetween(1, 5),
    unitPrice: laptop.sellingPrice,
    subtotal: laptop.sellingPrice * randomBetween(1, 5),
    discount: randomBetween(0, 5000),
  }));

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = Math.round(subtotal * 0.09);
  const shippingCost = randomBetween(500, 2000);
  const discount = items.reduce((sum, item) => sum + item.discount, 0);
  const total = subtotal + tax + shippingCost - discount;

  return {
    id: generateId(),
    createdAt: randomDate(new Date(2024, 0, 1), new Date()),
    updatedAt: randomDate(new Date(2024, 0, 1), new Date()),

    orderNumber: `ORD${randomBetween(100000, 999999)}`,
    customerId: customer.id,

    items,

    subtotal,
    tax,
    taxRate: 0.09,
    discount,
    shippingCost,
    total,

    status: randomItem(["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"] as const),
    paymentStatus: randomItem(["Unpaid", "Partial", "Paid", "Refunded"] as const),

    shippingAddress: `${customer.address}, ${customer.city}, ${customer.state} ${customer.postalCode}`,
    deliveryDate: randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),

    paymentMethod: randomItem(["Cash", "Card", "Bank Transfer", "Check"]),

    notes: "Rush delivery requested",
    invoiceNumber: `INV${randomBetween(100000, 999999)}`,
  };
}

export function seedOrders(count: number, laptops: Laptop[], customers: Customer[]): Order[] {
  return Array.from({ length: count }, () => generateOrder(laptops, customers));
}

// ==================== USER GENERATOR ====================

export function generateUser(role: "Admin" | "Manager" | "Staff" | "Salesperson"): User {
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);

  return {
    id: generateId(),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hm-trads.com`,
    name: `${firstName} ${lastName}`,
    role,
    isActive: true,
    lastLogin: randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
    createdAt: randomDate(new Date(2023, 0, 1), new Date()),
    updatedAt: randomDate(new Date(2024, 0, 1), new Date()),
  };
}

export function seedUsers(): User[] {
  return [
    {
      id: generateId(),
      email: "admin@hm-trads.com",
      name: "Admin User",
      role: "Admin",
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date(2023, 0, 1),
      updatedAt: new Date(),
    },
    ...Array.from({ length: 2 }, () => generateUser("Manager")),
    ...Array.from({ length: 3 }, () => generateUser("Staff")),
    ...Array.from({ length: 4 }, () => generateUser("Salesperson")),
  ];
}

// ==================== ANALYTICS DATA ====================

export const monthlyRevenue = [
  { month: "Jan", revenue: 420000, cost: 280000 },
  { month: "Feb", revenue: 510000, cost: 320000 },
  { month: "Mar", revenue: 480000, cost: 300000 },
  { month: "Apr", revenue: 610000, cost: 380000 },
  { month: "May", revenue: 720000, cost: 440000 },
  { month: "Jun", revenue: 680000, cost: 420000 },
  { month: "Jul", revenue: 810000, cost: 490000 },
  { month: "Aug", revenue: 920000, cost: 550000 },
  { month: "Sep", revenue: 850000, cost: 510000 },
  { month: "Oct", revenue: 990000, cost: 600000 },
  { month: "Nov", revenue: 1100000, cost: 650000 },
  { month: "Dec", revenue: 1240000, cost: 710000 },
];

export const b2bVsB2c = [
  { name: "B2B", value: 62 },
  { name: "B2C", value: 38 },
];

export const topBrands = [
  { brand: "Lenovo", sales: 142 },
  { brand: "HP", sales: 128 },
  { brand: "Dell", sales: 119 },
  { brand: "ASUS", sales: 86 },
  { brand: "Apple", sales: 71 },
  { brand: "MSI", sales: 54 },
  { brand: "Acer", sales: 47 },
];
