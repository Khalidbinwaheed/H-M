import { z } from "zod";
import {
  ProcessorBrand,
  ProcessorCategory,
  ProcessorGeneration,
  ProcessorSuffix,
  RAMType,
  RAMSize,
  StorageType,
  StorageSize,
  StorageBrand,
  ChargerType,
  ChargerWatt,
  CustomerType,
  Resolution,
  PanelType,
  TouchType,
  GPUType,
  GPUBrand,
  GPUSeries,
  LaptopCondition,
} from "./index";

// ==================== PROCESSOR ====================

export const processorSchema = z.object({
  brand: z.enum(["Intel", "Ryzen"] as const),
  category: z.enum([
    "Core i3", "Core i5", "Core i7", "Core i9",
    "Ryzen 3", "Ryzen 5", "Ryzen 7", "Ryzen 9"
  ] as const),
  generation: z.enum([
    "8th Gen", "10th Gen", "11th Gen", "12th Gen", "13th Gen", "14th Gen"
  ] as const),
  modelNumber: z.string().min(1, "Model number required"),
  suffix: z.enum(["U", "H", "HQ", "HX", "G", "P"] as const),
  displayName: z.string(),
});

// ==================== RAM ====================

export const ramSchema = z.object({
  type: z.enum(["DDR3", "DDR4", "DDR5"] as const),
  size: z.enum(["2GB", "4GB", "8GB", "16GB", "32GB", "64GB"] as const),
  brand: z.string().min(1, "RAM brand required"),
  slots: z.number().min(1),
  upgradeable: z.boolean(),
  displayName: z.string(),
});

// ==================== STORAGE ====================

export const storageSchema = z.object({
  type: z.enum(["SSD", "HDD", "NVMe"] as const),
  size: z.enum(["128GB", "256GB", "512GB", "1TB", "2TB"] as const),
  brand: z.enum(["Samsung", "Kingston", "WD", "Crucial", "Seagate"] as const),
  ssdSlots: z.number().min(0),
  hddSlots: z.number().min(0),
  extraNvmeSlot: z.boolean(),
  displayName: z.string(),
});

// ==================== GPU ====================

export const gpuSchema = z.object({
  type: z.enum(["Integrated", "Dedicated"] as const),
  brand: z.enum(["NVIDIA", "AMD", "Intel"] as const),
  series: z.enum(["Quadro", "RTX", "GTX", "MX", "Arc", "Radeon"] as const),
  model: z.string().min(1, "GPU model required"),
  memory: z.string().min(1, "GPU memory required"),
  displayName: z.string(),
});

// ==================== DISPLAY ====================

export const displaySchema = z.object({
  screenSize: z.string().min(1, "Screen size required"),
  resolution: z.enum(["HD", "FHD", "QHD", "2K", "4K"] as const),
  panelType: z.enum(["IPS", "OLED", "TN"] as const),
  touchType: z.enum(["Touch", "Non-Touch"] as const),
  refreshRate: z.string().min(1),
  brightness: z.string().min(1),
  antiGlare: z.boolean(),
  displayName: z.string(),
});

// ==================== BATTERY ====================

export const batterySchema = z.object({
  health: z.number().min(0).max(100),
  backupTime: z.string().min(1),
  cycleCount: z.number().min(0),
});

// ==================== LAPTOP CHARGER ====================

export const laptopChargerSchema = z.object({
  chargerId: z.string().min(1),
  chargerType: z.enum(["Type-C", "Lenovo Pin", "Dell Pin", "HP Pin", "Universal"] as const),
  watt: z.enum(["45W", "65W", "90W", "120W", "180W"] as const),
  isOriginal: z.boolean(),
  isIncluded: z.boolean(),
});

// ==================== LAPTOP FEATURES ====================

export const laptopFeaturesSchema = z.object({
  fingerprintSensor: z.boolean(),
  backlitKeyboard: z.boolean(),
  webcam: z.boolean(),
  hdmiPort: z.boolean(),
  usbTypeC: z.boolean(),
  lanPort: z.boolean(),
  wifi: z.boolean(),
  bluetooth: z.boolean(),
  keyboardType: z.string().min(1),
  operatingSystem: z.string().min(1),
  warranty: z.string().min(1),
  notes: z.string().optional(),
});

// ==================== LAPTOP ====================

export const laptopSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  
  name: z.string().min(1, "Laptop name required"),
  brand: z.string().min(1, "Brand required"),
  modelNumber: z.string().min(1, "Model number required"),
  serialNumber: z.string().min(1, "Serial number required"),
  sku: z.string().min(1, "SKU required"),
  barcode: z.string().min(1, "Barcode required"),
  condition: z.enum(["New", "Used", "Refurbished"] as const),
  
  processor: processorSchema,
  ram: ramSchema,
  storage: storageSchema,
  gpu: gpuSchema,
  display: displaySchema,
  battery: batterySchema,
  charger: laptopChargerSchema,
  features: laptopFeaturesSchema,
  
  purchasePrice: z.number().min(0),
  sellingPrice: z.number().min(0),
  currentQuantity: z.number().min(0),
  reorderLevel: z.number().min(0),
  location: z.string(),
  
  images: z.array(z.string()),
  thumbnail: z.string().optional(),
  
  isActive: z.boolean(),
  isFeatured: z.boolean(),
});

// ==================== CHARGER ====================

export const chargerSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  
  brand: z.string().min(1, "Charger brand required"),
  type: z.enum(["Type-C", "Lenovo Pin", "Dell Pin", "HP Pin", "Universal"] as const),
  watt: z.enum(["45W", "65W", "90W", "120W", "180W"] as const),
  compatibleBrands: z.array(z.string()),
  isOriginal: z.boolean(),
  
  quantity: z.number().min(0),
  purchasePrice: z.number().min(0),
  salePrice: z.number().min(0),
  stockStatus: z.enum(["In Stock", "Low Stock", "Out of Stock"] as const),
  reorderLevel: z.number().min(0),
  location: z.string(),
  
  image: z.string().optional(),
  
  isActive: z.boolean(),
});

// ==================== CUSTOMER ====================

export const customerSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  
  name: z.string().min(1, "Name required"),
  type: z.enum(["B2B", "B2C"] as const),
  
  phone: z.string().min(10, "Valid phone required"),
  whatsapp: z.string().optional(),
  email: z.string().email("Valid email required"),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  
  companyName: z.string().optional(),
  taxNumber: z.string().optional(),
  taxId: z.string().optional(),
  creditLimit: z.number().optional(),
  paymentTerms: z.string().optional(),
  
  totalPurchases: z.number(),
  totalAmount: z.number(),
  outstandingBalance: z.number(),
  lastPurchaseDate: z.date().optional(),
  
  isActive: z.boolean(),
  notes: z.string().optional(),
  
  profileImage: z.string().optional(),
});

// ==================== ORDER ====================

export const orderItemSchema = z.object({
  laptopId: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  subtotal: z.number().min(0),
  discount: z.number().min(0),
});

export const orderSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  
  orderNumber: z.string(),
  customerId: z.string(),
  
  items: z.array(orderItemSchema),
  
  subtotal: z.number(),
  tax: z.number(),
  taxRate: z.number(),
  discount: z.number(),
  shippingCost: z.number(),
  total: z.number(),
  
  status: z.enum(["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"] as const),
  paymentStatus: z.enum(["Unpaid", "Partial", "Paid", "Refunded"] as const),
  
  shippingAddress: z.string(),
  deliveryDate: z.date().optional(),
  
  paymentMethod: z.string(),
  paymentNotes: z.string().optional(),
  
  notes: z.string().optional(),
  invoiceNumber: z.string(),
  invoiceUrl: z.string().optional(),
});

// ==================== IMPORT/EXPORT ====================

export const inventoryImportSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  
  date: z.date(),
  supplierName: z.string(),
  invoiceNumber: z.string(),
  
  items: z.array(z.object({
    laptopId: z.string(),
    quantity: z.number().min(1),
    costPrice: z.number().min(0),
  })),
  
  totalCost: z.number(),
  invoiceUrl: z.string().optional(),
  notes: z.string().optional(),
  importedBy: z.string(),
});

export const inventoryExportSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  
  date: z.date(),
  customerId: z.string(),
  orderId: z.string(),
  invoiceNumber: z.string(),
  
  items: z.array(z.object({
    laptopId: z.string(),
    quantity: z.number().min(1),
    sellingPrice: z.number().min(0),
  })),
  
  totalRevenue: z.number(),
  totalProfit: z.number(),
  invoiceUrl: z.string().optional(),
  paymentStatus: z.enum(["Unpaid", "Partial", "Paid", "Refunded"] as const),
  deliveryStatus: z.enum(["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"] as const),
  exportedBy: z.string(),
});

// ==================== AUTH ====================

export const authCredentialsSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email("Valid email required"),
});

export const passwordResetSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ==================== FILTERS ====================

export const laptopFilterSchema = z.object({
  search: z.string().optional(),
  brand: z.string().optional(),
  processorBrand: z.enum(["Intel", "Ryzen"] as const).optional(),
  processorCategory: z.string().optional(),
  processorGeneration: z.string().optional(),
  processorSuffix: z.string().optional(),
  ramType: z.enum(["DDR3", "DDR4", "DDR5"] as const).optional(),
  ramSize: z.array(z.string()).optional(),
  storageType: z.enum(["SSD", "HDD", "NVMe"] as const).optional(),
  storageSize: z.array(z.string()).optional(),
  gpuSeries: z.string().optional(),
  gpuMemory: z.string().optional(),
  resolution: z.enum(["HD", "FHD", "QHD", "2K", "4K"] as const).optional(),
  panelType: z.enum(["IPS", "OLED", "TN"] as const).optional(),
  chargerType: z.string().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  condition: z.enum(["New", "Used", "Refurbished"] as const).optional(),
  warranty: z.string().optional(),
  stockStatus: z.enum(["In Stock", "Low Stock", "Out of Stock"] as const).optional(),
}).strict();

export const customerFilterSchema = z.object({
  search: z.string().optional(),
  type: z.enum(["B2B", "B2C"] as const).optional(),
  purchaseAmountMin: z.number().optional(),
  purchaseAmountMax: z.number().optional(),
  outstandingBalanceMin: z.number().optional(),
  outstandingBalanceMax: z.number().optional(),
  isActive: z.boolean().optional(),
}).strict();
