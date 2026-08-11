import { Pool } from 'pg';
import dotenv from 'dotenv';
import { newDb } from 'pg-mem';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

dotenv.config();

let pool: any;

const isMock = !process.env.DATABASE_URL || process.env.DATABASE_URL === 'placeholder_for_database_url';

if (!isMock) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else {
  console.log("Initializing pg-mem database...");
  const db = newDb();
  const schemaSql = fs.readFileSync(path.join(__dirname, '../../db/schema.sql'), 'utf-8');
  
  // Strip SERIAL and replace with INTEGER PRIMARY KEY AUTOINCREMENT maybe? 
  // No, pg-mem supports SERIAL perfectly.
  db.public.none(schemaSql);
  const pgMock = db.adapters.createPg();
  pool = new pgMock.Pool();
}

export const initDb = async () => {
  if (!isMock) return;
  console.log("Seeding in-memory database...");
  const client = await pool.connect();
  
  try {
    // Seed Users
    const roles = ['Admin', 'Sales', 'Warehouse', 'Accounts'];
    for (const role of roles) {
      const email = `${role.toLowerCase()}@test.com`;
      const pass = await bcrypt.hash('password123', 10);
      await client.query(`INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)`, [email, pass, role]);
    }

    // Seed Customers
    await client.query(`INSERT INTO customers (name, mobile, email, business_name, customer_type, status) VALUES 
         ('John Doe', '1234567890', 'john@example.com', 'Doe Inc', 'Retail', 'Active'),
         ('Jane Smith', '0987654321', 'jane@example.com', 'Smith Ltd', 'Wholesale', 'Lead'),
         ('Acme Corp', '1122334455', 'contact@acme.com', 'Acme', 'Distributor', 'Active')`);

    // Seed Products
    await client.query(`INSERT INTO products (name, sku, category, unit_price, current_stock) VALUES 
         ('Laptop', 'SKU-LPT-001', 'Electronics', 50000, 50),
         ('Mouse', 'SKU-MSE-002', 'Accessories', 500, 200),
         ('Keyboard', 'SKU-KBD-003', 'Accessories', 1500, 150),
         ('Monitor', 'SKU-MNT-004', 'Electronics', 12000, 30),
         ('Desk', 'SKU-DSK-005', 'Furniture', 4500, 10)`);
         
    console.log("In-memory database seeded successfully!");
  } catch (error) {
    console.error("Error seeding in-memory database:", error);
  } finally {
    client.release();
  }
};

export default pool;
