import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../src/data/db';

export default async function handler(req: Request, res: Response) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { email, token } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    try {
        const { rows } = await query(`
            SELECT u.*, r.name as role_name 
            FROM corporate_governance.users u 
            LEFT JOIN corporate_governance.roles r ON u.role_code = r.code
            WHERE u.email = $1
        `, [email]);

        if (rows.length === 0) return res.status(401).json({ error: 'Email not found' });

        const user = rows[0];

        if (!token) {
            // Step 1: Email is valid, prompt for token
            return res.status(200).json({ step: 'token_needed', message: 'Please provide a mock token' });
        }

        // Step 2: Token is provided (accept any token for now)
        const jwtToken = jwt.sign(
            { id: user.id, role: user.role_name, roleCode: user.role_code },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '24h' }
        );

        // Fetch menu permissions for this role
        const { rows: permissions } = await query(`
            SELECT menu_key, can_read, can_write
            FROM corporate_governance.menu_permissions
            WHERE role_code = $1
        `, [user.role_code]);

        return res.status(200).json({
            token: jwtToken,
            user: { id: user.id, email: user.email, name: user.name, role: user.role_name, roleCode: user.role_code },
            permissions: permissions.map((p: any) => ({ menuKey: p.menu_key, canRead: p.can_read, canWrite: p.can_write }))
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
