import { Request, Response } from 'express';
import pool from '../config/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password_hash } = req.body;
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Checking plain string or bcrypt hash
    const isMatch = password_hash === user.password_hash || await bcrypt.compare(password_hash, user.password_hash);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const payload = {
      id: user.id,
      role: user.role
    };

    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign(payload, secret, { expiresIn: '12h' });

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
