import type { Request, Response } from 'express';
import { query } from '../src/data/db';

export default async function handler(req: Request, res: Response) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { rows } = await query(`
            SELECT u.id, u.email, u.name, r.name as role, u.role_code as "roleCode", u.avatar_url as "avatarUrl", u.is_external as "isExternal"
            FROM corporate_governance.users u
            LEFT JOIN corporate_governance.roles r ON u.role_code = r.code
            ORDER BY u.name ASC
        `);

        return res.status(200).json(rows);
    } catch (error) {
        console.error('API Error - GET /api/users:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
