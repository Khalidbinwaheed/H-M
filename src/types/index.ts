// ==================== ENUMS ====================

export type LaptopCondition = "New" | "Used" | "Refurbished";
export type ProcessorBrand = "Intel" | "Ryzen";
export type ProcessorCategory =
  | "Core i3" | "Core i5" | "Core i7" | "Core i9"
  | "Ryzen 3" | "Ryzen 5" | "Ryzen 7" | "Ryzen 9";
export type ProcessorGeneration = "8th Gen" | "10th Gen" | "11th Gen" | "12th Gen" | "13th Gen" | "14th Gen";
export type ProcessorSuffix = "U" | "H" | "HQ" | "HX" | "G" | "P";
export type RAMType = "DDR3" | "DDR4" | "DDR5";
export type RAMSize = "2GB" | "4GB" | "8GB" | "16GB" | "32GB" | "64GB";
export type StorageType = "SSD" | "HDD" | "NVMe";
export type StorageSize = "128GB" | "256GB" | "512GB" | "1TB" | "2TB";
export type StorageBrand = "Samsung" | "Kingston" | "WD" | "Crucial" | "Seagate";
export type GPUType = "Integrated" | "Dedicated";
export type GPUBrand = "NVIDIA" | "AMD" | "Intel";
export type GPUSeries = "Quadro" | "RTX" | "GTX" | "MX" | "Arc" | "Radeon";
export type Resolution = "HD" | "FHD" | "QHD" | "2K" | "4K";
export type PanelType = "IPS" | "OLED" | "TN";
export type TouchType = "Touch" | "Non-Touch";
export type ChargerType = "Type-C" | "Lenovo Pin" | "Dell Pin" | "HP Pin" | "Universal";
export type ChargerWatt = "45W" | "65W" | "90W" | "120W" | "180W";
export type CustomerType = "B2B" | "B2C";
export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned";
export type PaymentStatus = "Unpaid" | "Partial" | "Paid" | "Refunded";
export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
export type UserRole = "Super Admin" | "Admin" | "Manager" | "Staff" | "Salesperson";

// ==================== LAPTOP ====================

export interface Processor {
  brand: ProcessorBrand;
  category: ProcessorCategory;
  generation: ProcessorGeneration;
  modelNumber: string; // e.g., 8265U, 12450H, 13700HX
  suffix: ProcessorSuffix;
  displayName: string; // e.g., Intel Core i7 12650H
}

export interface RAM {
  type: RAMType;
  size: RAMSize;
  brand: string;
  slots: number;
  upgradeable: boolean;
  displayName: string; // e.g., DDR4 8GB
}

export interface Storage {
  type: StorageType;
  size: StorageSize;
  brand: StorageBrand;
  ssdSlots: number;
  hddSlots: number;
  extraNvmeSlot: boolean;
  displayName: string; // e.g., 512GB SSD + 1TB HDD
}

export interface GPU {
  type: GPUType;
  brand: GPUBrand;
  series: GPUSeries;
  model: string; // e.g., RTX 4060
  memory: string; // e.g., 2GB GDDR5, 4GB GDDR6
  displayName: string; // e.g., NVIDIA RTX 4060 4GB GDDR6
}

export interface Display {
  screenSize: string; // e.g., 15.6"
  resolution: Resolution;
  panelType: PanelType;
  touchType: TouchType;
  refreshRate: string; // e.g., "60Hz", "144Hz"
  brightness: string; // e.g., "300 nits"
  antiGlare: boolean;
  displayName: string; // e.g., 15.6" FHD IPS 60Hz
}

export interface Battery {
  health: number; // 0-100 percentage
  backupTime: string; // e.g., "8 hours"
  cycleCount: number;
}

export interface LaptopCharger {
  chargerId: string;
  chargerType: ChargerType;
  watt: ChargerWatt;
  isOriginal: boolean;
  isIncluded: boolean;
}

export interface LaptopFeatures {
  fingerprintSensor: boolean;
  backlitKeyboard: boolean;
  webcam: boolean;
  hdmiPort: boolean;
  usbTypeC: boolean;
  lanPort: boolean;
  wifi: boolean;
  bluetooth: boolean;
  keyboardType: string; // e.g., "Chiclet", "Mechanical"
  operatingSystem: string; // e.g., "Windows 11 Pro", "Ubuntu 22.04"
  warranty: string; // e.g., "2 Years"
  notes: string;
}

export interface Laptop {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Basic Info
  name: string;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  sku: string;
  barcode: string;
  condition: LaptopCondition;
  
  // Specs
  processor: Processor;
  ram: RAM;
  storage: Storage;
  gpu: GPU;
  display: Display;
  battery: Battery;
  charger: LaptopCharger;
  features: LaptopFeatures;
  
  // Inventory
  purchasePrice: number;
  sellingPrice: number;
  currentQuantity: number;
  reorderLevel: number;
  location: string; // Warehouse location
  
  // Media
  images: string[]; // Image URLs
  thumbnail: string;
  
  // Status
  isActive: boolean;
  isFeatured: boolean;
}

// ==================== CHARGER ====================

export interface Charger {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  
  brand: string;
  type: ChargerType;
  watt: ChargerWatt;
  compatibleBrands: string[]; // e.g., ["Dell", "HP", "Lenovo"]
  isOriginal: boolean;
  
  // Inventory
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  stockStatus: StockStatus;
  reorderLevel: number;
  location: string;
  
  // Media
  image: string;
  
  // Status
  isActive: boolean;
}

// ==================== CUSTOMER ====================

export interface Customer {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  
  name: string;
  type: CustomerType;
  
  // Contact
  phone: string;
  whatsapp?: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // B2B Only
  companyName?: string;
  taxNumber?: string;
  taxId?: string;
  creditLimit?: number;
  paymentTerms?: string; // e.g., "Net 30"
  
  // Account Info
  totalPurchases: number;
  totalAmount: number;
  outstandingBalance: number;
  lastPurchaseDate?: Date;
  
  // Status
  isActive: boolean;
  notes: string;
  
  // Images
  profileImage?: string;
}

// ==================== ORDERS ====================

export interface OrderItem {
  laptopId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount: number; // Percentage or amount
}

export interface Order {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  
  orderNumber: string;
  customerId: string;
  
  items: OrderItem[];
  
  // Pricing
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  shippingCost: number;
  total: number;
  
  // Status
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  
  // Delivery
  shippingAddress: string;
  deliveryDate?: Date;
  
  // Payment
  paymentMethod: string; // e.g., "Cash", "Card", "Bank Transfer"
  paymentNotes: string;
  
  // Meta
  notes: string;
  invoiceNumber: string;
  invoiceUrl?: string;
}

// ==================== IMPORT/EXPORT ====================

export interface InventoryImport {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  
  date: Date;
  supplierName: string;
  invoiceNumber: string;
  
  items: Array<{
    laptopId: string;
    quantity: number;
    costPrice: number;
  }>;
  
  totalCost: number;
  invoiceUrl?: string;
  notes: string;
  importedBy: string; // User ID
}

export interface InventoryExport {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  
  date: Date;
  customerId: string;
  orderId: string;
  invoiceNumber: string;
  
  items: Array<{
    laptopId: string;
    quantity: number;
    sellingPrice: number;
  }>;
  
  totalRevenue: number;
  totalProfit: number;
  invoiceUrl?: string;
  paymentStatus: PaymentStatus;
  deliveryStatus: OrderStatus;
  exportedBy: string; // User ID
}

// ==================== ANALYTICS ====================

export interface DailySalesMetrics {
  date: Date;
  totalSales: number;
  totalOrders: number;
  totalRevenue: number;
  totalProfit: number;
  newCustomers: number;
  avgOrderValue: number;
}

export interface TopSellingProduct {
  laptopId: string;
  name: string;
  brand: string;
  totalQuantity: number;
  totalRevenue: number;
  imageUrl: string;
}

export interface AnalyticsData {
  totalLaptops: number;
  totalChargers: number;
  totalCustomers: number;
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  lowStockAlerts: number;
  
  dailyMetrics: DailySalesMetrics[];
  topSellingProducts: TopSellingProduct[];
  
  brandDistribution: Array<{
    brand: string;
    count: number;
    revenue: number;
  }>;
  
  b2bVsB2c: {
    b2b: {
      orders: number;
      revenue: number;
      customers: number;
    };
    b2c: {
      orders: number;
      revenue: number;
      customers: number;
    };
  };
}

// ==================== AUTHENTICATION ====================

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// ==================== NOTIFICATIONS ====================

export type NotificationType =
  | "low_stock"
  | "new_order"
  | "payment_pending"
  | "import_summary"
  | "export_summary"
  | "system_alert";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

// ==================== PAGINATION ====================

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}

// ==================== FILTERS ====================

export interface LaptopFilter {
  search?: string;
  brand?: string;
  processorBrand?: ProcessorBrand;
  processorCategory?: ProcessorCategory;
  processorGeneration?: ProcessorGeneration;
  processorSuffix?: ProcessorSuffix;
  ramType?: RAMType;
  ramSize?: RAMSize[];
  storageType?: StorageType;
  storageSize?: StorageSize[];
  gpuSeries?: GPUSeries;
  gpuMemory?: string;
  resolution?: Resolution;
  panelType?: PanelType;
  chargerType?: ChargerType;
  priceMin?: number;
  priceMax?: number;
  condition?: LaptopCondition;
  warranty?: string;
  stockStatus?: StockStatus;
}

export interface CustomerFilter {
  search?: string;
  type?: CustomerType;
  purchaseAmountMin?: number;
  purchaseAmountMax?: number;
  outstandingBalanceMin?: number;
  outstandingBalanceMax?: number;
  isActive?: boolean;
}

export interface InventoryFilter {
  stockStatus?: StockStatus[];
  location?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

// ==================== DASHBOARD ====================

export interface DashboardCard {
  title: string;
  value: number | string;
  change?: number; // Percentage
  icon: string;
  trend?: "up" | "down" | "neutral";
}

export interface DashboardOverview {
  cards: DashboardCard[];
  recentOrders: Order[];
  recentCustomers: Customer[];
  lowStockAlerts: Laptop[];
  topProducts: TopSellingProduct[];
}

// ==================== API RESPONSES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
