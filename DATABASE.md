# H&M Trads Admin Dashboard - Database Schema

## Overview
Enterprise-grade relational database schema for managing laptop and charger inventory, sales, and customer relationships.

## Database Design Principles
- **Normalization**: 3NF applied throughout
- **Referential Integrity**: Foreign key constraints ensure data consistency
- **Audit Trail**: Timestamps on all tables for tracking changes
- **Scalability**: Optimized indices for frequently queried columns
- **Security**: Role-based access control ready

## Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│     Users       │
├─────────────────┤
│ id (PK)         │
│ email (UQ)      │
│ name            │
│ role            │
│ password_hash   │
│ is_active       │
│ last_login      │
│ created_at      │
│ updated_at      │
└─────────────────┘
        │
        │
        ├─────────────────────────────────────┐
        │                                       │
        ▼                                       ▼
┌──────────────────┐            ┌──────────────────────┐
│   Laptops        │            │  Orders              │
├──────────────────┤            ├──────────────────────┤
│ id (PK)          │◄────────┐  │ id (PK)              │
│ brand            │         │  │ order_number (UQ)    │
│ model_number     │         │  │ customer_id (FK)     │
│ serial_number    │         │  │ created_by (FK→Users)│
│ sku (UQ)         │         │  │ status               │
│ barcode (UQ)     │         │  │ payment_status       │
│ condition        │         │  │ subtotal             │
│ processor_*      │         │  │ tax                  │
│ ram_*            │         ├──│ tax_rate             │
│ storage_*        │         │  │ discount             │
│ gpu_*            │         │  │ shipping_cost        │
│ display_*        │         │  │ total                │
│ battery_*        │         │  │ payment_method       │
│ charger_*        │         │  │ invoice_number       │
│ features_*       │         │  │ shipping_address     │
│ purchase_price   │         │  │ delivery_date        │
│ selling_price    │         │  │ created_at           │
│ quantity         │         │  │ updated_at           │
│ reorder_level    │         │  └──────────────────────┘
│ location         │         │
│ images           │         │
│ is_active        │         │
│ is_featured      │         │
│ created_at       │         │
│ updated_at       │         │
└──────────────────┘         │
        │                    │
        │        ┌───────────┘
        │        │
        │        ▼
        │    ┌──────────────────┐
        │    │ Order Items      │
        │    ├──────────────────┤
        │    │ id (PK)          │
        │    │ order_id (FK)    │
        │    │ laptop_id (FK)◄──┤
        │    │ quantity         │
        │    │ unit_price       │
        │    │ subtotal         │
        │    │ discount         │
        │    └──────────────────┘
        │
        │
        ▼
┌──────────────────┐
│   Chargers       │
├──────────────────┤
│ id (PK)          │
│ brand            │
│ type             │
│ watt             │
│ compatible_      │
│ brands           │
│ is_original      │
│ quantity         │
│ purchase_price   │
│ sale_price       │
│ stock_status     │
│ reorder_level    │
│ location         │
│ image            │
│ is_active        │
│ created_at       │
│ updated_at       │
└──────────────────┘


┌──────────────────┐
│   Customers      │
├──────────────────┤
│ id (PK)          │
│ name             │
│ type (B2B/B2C)   │
│ phone            │
│ whatsapp         │
│ email (UQ)       │
│ address          │
│ city             │
│ state            │
│ postal_code      │
│ country          │
│ company_name     │
│ tax_number       │
│ tax_id           │
│ credit_limit     │
│ payment_terms    │
│ total_purchases  │
│ total_amount     │
│ outstanding_bal. │
│ last_purchase    │
│ is_active        │
│ notes            │
│ created_at       │
│ updated_at       │
└──────────────────┘
        │
        │
        ▼
┌──────────────────┐
│ Import Logs      │
├──────────────────┤
│ id (PK)          │
│ date             │
│ supplier_name    │
│ invoice_number   │
│ total_cost       │
│ imported_by (FK) │
│ invoice_url      │
│ notes            │
│ created_at       │
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ Import Items     │
├──────────────────┤
│ id (PK)          │
│ import_id (FK)   │
│ laptop_id (FK)   │
│ quantity         │
│ cost_price       │
└──────────────────┘


┌──────────────────┐
│ Export Logs      │
├──────────────────┤
│ id (PK)          │
│ date             │
│ customer_id (FK) │
│ order_id (FK)    │
│ invoice_number   │
│ total_revenue    │
│ total_profit     │
│ payment_status   │
│ delivery_status  │
│ exported_by (FK) │
│ invoice_url      │
│ created_at       │
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ Export Items     │
├──────────────────┤
│ id (PK)          │
│ export_id (FK)   │
│ laptop_id (FK)   │
│ quantity         │
│ selling_price    │
└──────────────────┘


┌──────────────────────┐
│ Notifications        │
├──────────────────────┤
│ id (PK)              │
│ user_id (FK)         │
│ type                 │
│ title                │
│ message              │
│ data (JSON)          │
│ read                 │
│ created_at           │
└──────────────────────┘
```

## Table Definitions

### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'Staff',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT role_check CHECK (role IN ('Admin', 'Manager', 'Staff', 'Salesperson'))
);
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

### Laptops
```sql
CREATE TABLE laptops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand VARCHAR(100) NOT NULL,
  model_number VARCHAR(100) NOT NULL,
  serial_number VARCHAR(100) UNIQUE NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  barcode VARCHAR(100) UNIQUE NOT NULL,
  condition VARCHAR(50) NOT NULL DEFAULT 'New',
  
  -- Processor
  processor_brand VARCHAR(50) NOT NULL,
  processor_category VARCHAR(50) NOT NULL,
  processor_generation VARCHAR(20) NOT NULL,
  processor_model VARCHAR(50) NOT NULL,
  processor_suffix VARCHAR(10) NOT NULL,
  
  -- RAM
  ram_type VARCHAR(20) NOT NULL,
  ram_size VARCHAR(20) NOT NULL,
  ram_brand VARCHAR(100),
  ram_slots INTEGER,
  ram_upgradeable BOOLEAN,
  
  -- Storage
  storage_type VARCHAR(20) NOT NULL,
  storage_size VARCHAR(20) NOT NULL,
  storage_brand VARCHAR(100),
  ssd_slots INTEGER,
  hdd_slots INTEGER,
  extra_nvme_slot BOOLEAN,
  
  -- GPU
  gpu_type VARCHAR(50),
  gpu_brand VARCHAR(100),
  gpu_series VARCHAR(50),
  gpu_model VARCHAR(100),
  gpu_memory VARCHAR(50),
  
  -- Display
  screen_size VARCHAR(20),
  resolution VARCHAR(20),
  panel_type VARCHAR(20),
  touch_type VARCHAR(20),
  refresh_rate VARCHAR(20),
  brightness VARCHAR(20),
  anti_glare BOOLEAN,
  
  -- Battery
  battery_health INTEGER,
  battery_backup_time VARCHAR(20),
  battery_cycle_count INTEGER,
  
  -- Charger
  charger_type VARCHAR(50),
  charger_watt VARCHAR(20),
  charger_is_original BOOLEAN,
  charger_is_included BOOLEAN,
  
  -- Features
  fingerprint_sensor BOOLEAN,
  backlit_keyboard BOOLEAN,
  webcam BOOLEAN,
  hdmi_port BOOLEAN,
  usb_type_c BOOLEAN,
  lan_port BOOLEAN,
  wifi BOOLEAN,
  bluetooth BOOLEAN,
  keyboard_type VARCHAR(100),
  operating_system VARCHAR(100),
  warranty VARCHAR(50),
  notes TEXT,
  
  -- Pricing & Inventory
  purchase_price DECIMAL(12, 2) NOT NULL,
  selling_price DECIMAL(12, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER DEFAULT 5,
  location VARCHAR(100),
  
  -- Media
  images JSON,
  thumbnail_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT condition_check CHECK (condition IN ('New', 'Used', 'Refurbished')),
  CONSTRAINT price_check CHECK (selling_price >= 0 AND purchase_price >= 0)
);
CREATE INDEX idx_laptops_brand ON laptops(brand);
CREATE INDEX idx_laptops_processor ON laptops(processor_brand, processor_category);
CREATE INDEX idx_laptops_sku ON laptops(sku);
CREATE INDEX idx_laptops_barcode ON laptops(barcode);
CREATE INDEX idx_laptops_active ON laptops(is_active);
```

### Orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Pricing
  subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(12, 2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
  discount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  shipping_cost DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL DEFAULT 0,
  
  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'Unpaid',
  
  -- Delivery
  shipping_address TEXT,
  delivery_date TIMESTAMP,
  
  -- Payment
  payment_method VARCHAR(100),
  payment_notes TEXT,
  
  -- Meta
  notes TEXT,
  invoice_number VARCHAR(100),
  invoice_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT status_check CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned')),
  CONSTRAINT payment_check CHECK (payment_status IN ('Unpaid', 'Partial', 'Paid', 'Refunded'))
);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment ON orders(payment_status);
CREATE INDEX idx_orders_date ON orders(created_at DESC);
```

### Customers
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL,
  
  -- Contact
  phone VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20),
  email VARCHAR(255),
  address TEXT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'India',
  
  -- B2B Info
  company_name VARCHAR(255),
  tax_number VARCHAR(100),
  tax_id VARCHAR(100),
  credit_limit DECIMAL(12, 2),
  payment_terms VARCHAR(100),
  
  -- Account
  total_purchases INTEGER DEFAULT 0,
  total_amount DECIMAL(12, 2) DEFAULT 0,
  outstanding_balance DECIMAL(12, 2) DEFAULT 0,
  last_purchase_date TIMESTAMP,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT type_check CHECK (type IN ('B2B', 'B2C'))
);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_type ON customers(type);
CREATE INDEX idx_customers_active ON customers(is_active);
```

### Chargers
```sql
CREATE TABLE chargers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  watt VARCHAR(20) NOT NULL,
  compatible_brands JSON,
  is_original BOOLEAN DEFAULT true,
  
  -- Inventory
  quantity INTEGER NOT NULL DEFAULT 0,
  purchase_price DECIMAL(12, 2) NOT NULL,
  sale_price DECIMAL(12, 2) NOT NULL,
  stock_status VARCHAR(50) DEFAULT 'In Stock',
  reorder_level INTEGER DEFAULT 10,
  location VARCHAR(100),
  
  -- Media
  image_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT stock_check CHECK (stock_status IN ('In Stock', 'Low Stock', 'Out of Stock'))
);
CREATE INDEX idx_chargers_type ON chargers(type);
CREATE INDEX idx_chargers_brand ON chargers(brand);
```

## Indexing Strategy

**For Performance**: 
- Foreign keys (FK)
- Frequently queried columns (status, type, is_active)
- Date ranges (created_at)
- Unique constraints (sku, barcode, email)

**Composite Indices**:
```sql
CREATE INDEX idx_orders_customer_date ON orders(customer_id, created_at DESC);
CREATE INDEX idx_laptops_search ON laptops(brand, processor_brand, ram_size);
```

## Data Types & Constraints

| Data Type | Usage | Examples |
|-----------|-------|----------|
| UUID | Primary keys | All IDs |
| VARCHAR | Short text | Names, codes |
| TEXT | Long text | Descriptions, notes |
| DECIMAL(12,2) | Money | Prices, amounts |
| INTEGER | Counts | Quantities, slots |
| BOOLEAN | Flags | is_active, is_original |
| TIMESTAMP | Time tracking | created_at, updated_at |
| JSON | Flexible data | Images array, metadata |

## Growth Projections

```
Year 1: ~10,000 laptops, 5,000 chargers, 2,000 customers
Year 2: ~50,000 laptops, 25,000 chargers, 10,000 customers
Year 3: ~100,000 laptops, 50,000 chargers, 25,000 customers
```

**Archive Strategy**: 
- Orders > 2 years old → Archive tables
- Logs > 1 year old → Compress or delete
- Soft deletes for compliance

## Backup & Recovery

- **Daily backups**: Full backup every night
- **Weekly**: Incremental backups
- **Monthly**: Archive to cold storage
- **Recovery RTO**: < 4 hours
- **Recovery RPO**: < 1 hour
