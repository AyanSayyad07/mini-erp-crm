import { Request, Response } from 'express';
import pool from '../config/db';

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, sku, category, unit_price, current_stock, min_stock_alert, location } = req.body;
    const result = await pool.query(
      `INSERT INTO products (name, sku, category, unit_price, current_stock, min_stock_alert, location) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, sku, category, unit_price, current_stock || 0, min_stock_alert || 0, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', search = '', category } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let query = `SELECT * FROM products WHERE (name ILIKE $1 OR sku ILIKE $1)`;
    const params: any[] = [`%${search}%`];
    let paramIndex = 2;

    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    const countQuery = `SELECT COUNT(*) FROM (${query}) AS temp`;
    const countResult = await pool.query(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].count);

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit as string), offset);

    const result = await pool.query(query, params);
    res.json({
      data: result.rows,
      total: totalCount,
      page: parseInt(page as string),
      totalPages: Math.ceil(totalCount / parseInt(limit as string))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, sku, category, unit_price, current_stock, min_stock_alert, location } = req.body;
    const result = await pool.query(
      `UPDATE products SET 
       name = COALESCE($1, name), 
       sku = COALESCE($2, sku), 
       category = COALESCE($3, category), 
       unit_price = COALESCE($4, unit_price), 
       current_stock = COALESCE($5, current_stock), 
       min_stock_alert = COALESCE($6, min_stock_alert), 
       location = COALESCE($7, location)
       WHERE id = $8 RETURNING *`,
      [name, sku, category, unit_price, current_stock, min_stock_alert, location, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
