-- 1. Users Table (Authentication & Roles)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('Admin', 'Sales', 'Warehouse', 'Accounts')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customers Table (CRM Module)
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    business_name VARCHAR(255),
    gst_number VARCHAR(50),
    customer_type VARCHAR(50) CHECK (customer_type IN ('Retail', 'Wholesale', 'Distributor')) NOT NULL,
    address TEXT,
    status VARCHAR(50) CHECK (status IN ('Lead', 'Active', 'Inactive')) DEFAULT 'Lead',
    follow_up_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table (Inventory Module)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100),
    unit_price FLOAT NOT NULL,
    current_stock INT DEFAULT 0,
    min_stock_alert INT DEFAULT 0,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Stock Movement Log
CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity_changed INT NOT NULL,
    movement_type VARCHAR(10) CHECK (movement_type IN ('IN', 'OUT')) NOT NULL,
    reason TEXT,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Sales Challan Table
CREATE TABLE challans (
    id SERIAL PRIMARY KEY,
    challan_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id INT REFERENCES customers(id),
    total_quantity INT NOT NULL DEFAULT 0,
    status VARCHAR(50) CHECK (status IN ('Draft', 'Confirmed', 'Delivered', 'Paid', 'Cancelled')) DEFAULT 'Draft',
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Challan Items (Stores snapshot data to prevent historical data mutation)
CREATE TABLE challan_items (
    id SERIAL PRIMARY KEY,
    challan_id INT REFERENCES challans(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    product_name_snapshot VARCHAR(255) NOT NULL,
    unit_price_snapshot FLOAT NOT NULL,
    quantity INT NOT NULL
);
