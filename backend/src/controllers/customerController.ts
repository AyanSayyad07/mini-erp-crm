import { Request, Response } from 'express';
import pool from '../config/db';

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, mobile, email, business_name, gst_number, customer_type, address, status, follow_up_date, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO customers (name, mobile, email, business_name, gst_number, customer_type, address, status, follow_up_date, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [name, mobile, email, business_name, gst_number, customer_type, address, status || 'Lead', follow_up_date, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', search = '', status } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let query = `SELECT * FROM customers WHERE (name ILIKE $1 OR mobile ILIKE $1 OR business_name ILIKE $1)`;
    const params: any[] = [`%${search}%`];
    let paramIndex = 2;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
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

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, mobile, email, business_name, gst_number, customer_type, address, status, follow_up_date, notes } = req.body;
    const result = await pool.query(
      `UPDATE customers SET 
       name = COALESCE($1, name), 
       mobile = COALESCE($2, mobile), 
       email = COALESCE($3, email), 
       business_name = COALESCE($4, business_name), 
       gst_number = COALESCE($5, gst_number), 
       customer_type = COALESCE($6, customer_type), 
       address = COALESCE($7, address), 
       status = COALESCE($8, status), 
       follow_up_date = COALESCE($9, follow_up_date), 
       notes = COALESCE($10, notes)
       WHERE id = $11 RETURNING *`,
      [name, mobile, email, business_name, gst_number, customer_type, address, status, follow_up_date, notes, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
