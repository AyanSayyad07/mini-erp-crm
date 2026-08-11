import { Request, Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createChallan = async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    const { customer_id, items, status } = req.body;
    const userId = req.user?.id;

    if (!customer_id || !items || items.length === 0) {
      res.status(400).json({ message: 'Invalid data' });
      return;
    }

    await client.query('BEGIN');

    // Generate challan number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
    const challan_number = `CHLN-${dateStr}-${randomStr}`;

    let total_quantity = 0;

    // Check stock for confirmed challans
    if (status === 'Confirmed') {
      for (const item of items) {
        const productRes = await client.query('SELECT name, current_stock FROM products WHERE id = $1', [item.product_id]);
        const product = productRes.rows[0];

        if (!product || product.current_stock < item.quantity) {
          await client.query('ROLLBACK');
          res.status(400).json({ message: `Insufficient stock for product: ${product ? product.name : item.product_id}` });
          return;
        }
      }
    }

    // Insert Challan
    for (const item of items) {
      total_quantity += item.quantity;
    }

    const challanRes = await client.query(
      `INSERT INTO challans (challan_number, customer_id, total_quantity, status, created_by) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [challan_number, customer_id, total_quantity, status || 'Draft', userId]
    );
    const challanId = challanRes.rows[0].id;

    // Process items
    for (const item of items) {
      const productRes = await client.query('SELECT name, unit_price FROM products WHERE id = $1', [item.product_id]);
      const product = productRes.rows[0];

      await client.query(
        `INSERT INTO challan_items (challan_id, product_id, product_name_snapshot, unit_price_snapshot, quantity) 
         VALUES ($1, $2, $3, $4, $5)`,
        [challanId, item.product_id, product.name, product.unit_price, item.quantity]
      );

      if (status === 'Confirmed') {
        await client.query(
          `UPDATE products SET current_stock = current_stock - $1 WHERE id = $2`,
          [item.quantity, item.product_id]
        );

        await client.query(
          `INSERT INTO stock_movements (product_id, quantity_changed, movement_type, reason, created_by) 
           VALUES ($1, $2, $3, $4, $5)`,
          [item.product_id, -item.quantity, 'OUT', `Sales Challan ${challan_number}`, userId]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(challanRes.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
};

export const getChallans = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.challan_number, c.total_quantity, c.status, c.created_at, cu.name as customer_name 
       FROM challans c 
       LEFT JOIN customers cu ON c.customer_id = cu.id 
       ORDER BY c.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getChallanById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const challanRes = await pool.query(
      `SELECT c.*, cu.name as customer_name, cu.mobile, cu.address 
       FROM challans c 
       LEFT JOIN customers cu ON c.customer_id = cu.id 
       WHERE c.id = $1`, 
      [id]
    );

    if (challanRes.rows.length === 0) {
      res.status(404).json({ message: 'Challan not found' });
      return;
    }

    const itemsRes = await pool.query('SELECT * FROM challan_items WHERE challan_id = $1', [id]);
    
    res.json({
      ...challanRes.rows[0],
      items: itemsRes.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateChallanStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query('UPDATE challans SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Challan not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
