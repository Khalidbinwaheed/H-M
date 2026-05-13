-- ==================== USERS TABLE ====================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Manager', 'Staff', 'Salesperson')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ==================== CUSTOMERS TABLE ====================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  name VARCHAR(255) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('B2B', 'B2C')),
  
  phone VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20),
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  
  -- B2B Only
  company_name VARCHAR(255),
  tax_number VARCHAR(50),
  tax_id VARCHAR(50),
  credit_limit DECIMAL(12, 2),
  payment_terms VARCHAR(100),
  
  -- Account Info
  total_purchases INTEGER DEFAULT 0,
  total_amount DECIMAL(12, 2) DEFAULT 0,
  outstanding_balance DECIMAL(12, 2) DEFAULT 0,
  last_purchase_date TIMESTAMP WITH TIME ZONE,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  profile_image TEXT
);

CREATE INDEX idx_customers_type ON customers(type);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_is_active ON customers(is_active);

-- ==================== LAPTOPS TABLE ====================
CREATE TABLE laptops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Basic Info
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model_number VARCHAR(100) NOT NULL,
  serial_number VARCHAR(255),
  sku VARCHAR(100) UNIQUE NOT NULL,
  barcode VARCHAR(255),
  condition VARCHAR(50) NOT NULL CHECK (condition IN ('New', 'Used', 'Refurbished')),
  
  -- Specs (JSON format for flexibility)
  processor JSONB NOT NULL, -- {"brand": "Intel", "category": "Core i7", "generation": "12th Gen", "modelNumber": "12700H", "suffix": "H", "displayName": "Intel Core i7 12700H"}
  ram JSONB NOT NULL, -- {"type": "DDR4", "size": "16GB", "brand": "Corsair", "slots": 2, "upgradeable": true, "displayName": "DDR4 16GB"}
  storage JSONB NOT NULL, -- {"type": "SSD", "size": "512GB", "brand": "Samsung", "ssdSlots": 1, "hddSlots": 0, "extraNvmeSlot": true, "displayName": "512GB SSD"}
  gpu JSONB NOT NULL, -- {"type": "Dedicated", "brand": "NVIDIA", "series": "RTX", "model": "RTX 4060", "memory": "4GB GDDR6", "displayName": "NVIDIA RTX 4060 4GB GDDR6"}
  display JSONB NOT NULL, -- {"screenSize": "15.6", "resolution": "FHD", "panelType": "IPS", "touchType": "Non-Touch", "refreshRate": "60Hz", "brightness": "300 nits", "antiGlare": false, "displayName": "15.6\" FHD IPS 60Hz"}
  battery JSONB, -- {"health": 100, "backupTime": "8 hours", "cycleCount": 0}
  charger JSONB NOT NULL, -- {"chargerId": "uuid", "chargerType": "Type-C", "watt": "65W", "isOriginal": true, "isIncluded": true}
  features JSONB NOT NULL, -- {"fingerprintSensor": true, "backlitKeyboard": true, "webcam": true, "hdmiPort": true, "usbTypeC": true, "lanPort": false, "wifi": true, "bluetooth": true, "keyboardType": "Chiclet", "operatingSystem": "Windows 11 Pro", "warranty": "2 Years", "notes": ""}
  
  -- Inventory
  purchase_price DECIMAL(10, 2) NOT NULL,
  selling_price DECIMAL(10, 2) NOT NULL,
  current_quantity INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER DEFAULT 5,
  location VARCHAR(255),
  
  -- Media
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  thumbnail TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  CHECK (selling_price > 0),
  CHECK (purchase_price > 0)
);

CREATE INDEX idx_laptops_brand ON laptops(brand);
CREATE INDEX idx_laptops_sku ON laptops(sku);
CREATE INDEX idx_laptops_is_active ON laptops(is_active);
CREATE INDEX idx_laptops_is_featured ON laptops(is_featured);
CREATE INDEX idx_laptops_condition ON laptops(condition);

-- ==================== CHARGERS TABLE ====================
CREATE TABLE chargers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  brand VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Type-C', 'Lenovo Pin', 'Dell Pin', 'HP Pin', 'Universal')),
  watt VARCHAR(20) NOT NULL CHECK (watt IN ('45W', '65W', '90W', '120W', '180W')),
  compatible_brands TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_original BOOLEAN DEFAULT true,
  
  -- Inventory
  quantity INTEGER NOT NULL DEFAULT 0,
  purchase_price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2) NOT NULL,
  stock_status VARCHAR(50) NOT NULL CHECK (stock_status IN ('In Stock', 'Low Stock', 'Out of Stock')) DEFAULT 'In Stock',
  reorder_level INTEGER DEFAULT 10,
  location VARCHAR(255),
  
  -- Media
  image TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  CHECK (sale_price > 0),
  CHECK (purchase_price > 0)
);

CREATE INDEX idx_chargers_brand ON chargers(brand);
CREATE INDEX idx_chargers_type ON chargers(type);
CREATE INDEX idx_chargers_watt ON chargers(watt);
CREATE INDEX idx_chargers_is_active ON chargers(is_active);

-- ==================== ORDERS TABLE ====================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  
  -- Pricing
  subtotal DECIMAL(12, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  
  -- Status
  status VARCHAR(50) NOT NULL CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned')) DEFAULT 'Pending',
  payment_status VARCHAR(50) NOT NULL CHECK (payment_status IN ('Unpaid', 'Partial', 'Paid', 'Refunded')) DEFAULT 'Unpaid',
  
  -- Delivery
  shipping_address TEXT NOT NULL,
  delivery_date TIMESTAMP WITH TIME ZONE,
  
  -- Payment
  payment_method VARCHAR(100),
  payment_notes TEXT,
  
  -- Meta
  notes TEXT,
  invoice_number VARCHAR(50),
  invoice_url TEXT,
  created_by UUID REFERENCES users(id),
  
  CHECK (total >= 0)
);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- ==================== ORDER ITEMS TABLE ====================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  laptop_id UUID NOT NULL REFERENCES laptops(id) ON DELETE RESTRICT,
  
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_laptop_id ON order_items(laptop_id);

-- ==================== INVENTORY IMPORTS TABLE ====================
CREATE TABLE inventory_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  supplier_name VARCHAR(255) NOT NULL,
  invoice_number VARCHAR(50),
  
  items JSONB NOT NULL, -- Array of {laptopId, quantity, costPrice}
  total_cost DECIMAL(12, 2) NOT NULL,
  invoice_url TEXT,
  notes TEXT,
  imported_by UUID REFERENCES users(id)
);

CREATE INDEX idx_inventory_imports_supplier ON inventory_imports(supplier_name);
CREATE INDEX idx_inventory_imports_date ON inventory_imports(date);
CREATE INDEX idx_inventory_imports_imported_by ON inventory_imports(imported_by);

-- ==================== INVENTORY EXPORTS TABLE ====================
CREATE TABLE inventory_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  invoice_number VARCHAR(50),
  
  items JSONB NOT NULL, -- Array of {laptopId, quantity, sellingPrice}
  total_revenue DECIMAL(12, 2) NOT NULL,
  total_profit DECIMAL(12, 2),
  invoice_url TEXT,
  payment_status VARCHAR(50) NOT NULL CHECK (payment_status IN ('Unpaid', 'Partial', 'Paid', 'Refunded')),
  delivery_status VARCHAR(50) NOT NULL CHECK (delivery_status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned')),
  exported_by UUID REFERENCES users(id)
);

CREATE INDEX idx_inventory_exports_customer_id ON inventory_exports(customer_id);
CREATE INDEX idx_inventory_exports_date ON inventory_exports(date);
CREATE INDEX idx_inventory_exports_exported_by ON inventory_exports(exported_by);

-- ==================== DAILY SALES METRICS TABLE ====================
CREATE TABLE daily_sales_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  
  total_sales DECIMAL(12, 2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  total_profit DECIMAL(12, 2) DEFAULT 0,
  new_customers INTEGER DEFAULT 0,
  avg_order_value DECIMAL(10, 2) DEFAULT 0
);

CREATE INDEX idx_daily_sales_metrics_date ON daily_sales_metrics(date);

-- ==================== AUTO-UPDATE TIMESTAMPS ====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_update_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER customers_update_timestamp BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER laptops_update_timestamp BEFORE UPDATE ON laptops FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER chargers_update_timestamp BEFORE UPDATE ON chargers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_update_timestamp BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER inventory_imports_update_timestamp BEFORE UPDATE ON inventory_imports FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER inventory_exports_update_timestamp BEFORE UPDATE ON inventory_exports FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==================== SAMPLE DATA (OPTIONAL) ====================
-- Insert a default admin user
INSERT INTO users (email, full_name, role, is_active)
VALUES (
  'admin@hmtrads.com',
  'Admin User',
  'Admin',
  true
) ON CONFLICT (email) DO NOTHING;

-- Enable Row Level Security (Recommended for Supabase)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE laptops ENABLE ROW LEVEL SECURITY;
ALTER TABLE chargers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_sales_metrics ENABLE ROW LEVEL SECURITY;
