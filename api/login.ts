import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '../src/data/db';

export default async function handler(req: Request, res: Response) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
        const { rows } = await query(`
            SELECT u.*, r.name as role_name 
            FROM corporate_governance.users u 
            LEFT JOIN corporate_governance.roles r ON u.role_code = r.code
            WHERE u.email = $1
        `, [email]);
        if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = rows[0];
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, role: user.role_name, roleCode: user.role_code },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role_name, roleCode: user.role_code }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
