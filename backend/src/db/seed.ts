import pool from '../config/db';
import bcrypt from 'bcryptjs';

const seed = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Seeding Database...');

    // Users
    const roles = ['Admin', 'Sales', 'Warehouse', 'Accounts'];
    for (const role of roles) {
      const email = `${role.toLowerCase()}@test.com`;
      const pass = await bcrypt.hash('password123', 10);
      await client.query(
        `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING`,
        [email, pass, role]
      );
    }

    // Customers
    await client.query(
      `INSERT INTO customers (name, mobile, email, business_name, customer_type, status) VALUES 
       ('John Doe', '1234567890', 'john@example.com', 'Doe Inc', 'Retail', 'Active'),
       ('Jane Smith', '0987654321', 'jane@example.com', 'Smith Ltd', 'Wholesale', 'Lead'),
       ('Acme Corp', '1122334455', 'contact@acme.com', 'Acme', 'Distributor', 'Active')`
    );

    // Products
    await client.query(
      `INSERT INTO products (name, sku, category, unit_price, current_stock) VALUES 
       ('Laptop', 'SKU-LPT-001', 'Electronics', 50000, 50),
       ('Mouse', 'SKU-MSE-002', 'Accessories', 500, 200),
       ('Keyboard', 'SKU-KBD-003', 'Accessories', 1500, 150),
       ('Monitor', 'SKU-MNT-004', 'Electronics', 12000, 30),
       ('Desk', 'SKU-DSK-005', 'Furniture', 4500, 10)
       ON CONFLICT (sku) DO NOTHING`
    );

    await client.query('COMMIT');
    console.log('Seeding Complete!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding Error:', error);
  } finally {
    client.release();
    process.exit();
  }
};

seed();
