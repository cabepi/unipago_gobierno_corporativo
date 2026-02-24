import type { Request, Response } from 'express';
import pool, { query } from '../src/data/db';

export default async function handler(req: Request, res: Response) {
    if (req.method === 'GET') {
        try {
            // Fetch all committees and embed their members using json_agg
            const { rows } = await query(`
                SELECT 
                    c.id, c.name, c.type, c.description, c.created_at as "createdAt",
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'userId', cm.user_id,
                                'role', cm.role,
                                'userName', u.name,
                                'userAvatar', u.avatar_url,
                                'isExternal', u.is_external
                            )
                        ) FILTER (WHERE cm.user_id IS NOT NULL), 
                    '[]') as members
                FROM corporate_governance.committees c
                LEFT JOIN corporate_governance.committee_members cm ON c.id = cm.committee_id
                LEFT JOIN corporate_governance.users u ON cm.user_id = u.id
                GROUP BY c.id
                ORDER BY c.created_at DESC
            `);

            // Translate Internal values
            const formatted = rows.map(r => ({
                id: r.id,
                name: r.name,
                type: r.type === 'INTERNAL' ? 'Interno' : 'Externo',
                description: r.description,
                createdAt: r.createdAt,
                members: r.members.map((m: any) => ({
                    userId: m.userId,
                    role: m.role === 'SECRETARY' ? 'Secretario' : m.role === 'SUPPORT' ? 'Soporte' : 'Miembro',
                    // Hydrate user info locally
                    user: { name: m.userName, avatarUrl: m.userAvatar, isExternal: m.isExternal }
                }))
            }));

            return res.status(200).json(formatted);
        } catch (error) {
            console.error('API Error - GET /api/committees:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    if (req.method === 'POST') {
        const client = await pool.connect();
        try {
            const { name, description, type, members } = req.body;
            if (!name || !type || !members || !Array.isArray(members)) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const dbType = type === 'Interno' ? 'INTERNAL' : 'EXTERNAL';

            await client.query('BEGIN');

            const insertCommittee = `
                INSERT INTO corporate_governance.committees (name, description, type)
                VALUES ($1, $2, $3)
                RETURNING id, created_at as "createdAt"
            `;
            const { rows: committeeRows } = await client.query(insertCommittee, [name, description, dbType]);
            const newCommitteeId = committeeRows[0].id;

            if (members.length > 0) {
                const insertMembers = `
                    INSERT INTO corporate_governance.committee_members (committee_id, user_id, role)
                    VALUES ($1, $2, $3)
                `;
                for (const member of members) {
                    const dbRole = member.role === 'Secretario' ? 'SECRETARY' : member.role === 'Soporte' ? 'SUPPORT' : 'MEMBER';
                    await client.query(insertMembers, [newCommitteeId, member.userId, dbRole]);
                }
            }

            await client.query('COMMIT');

            return res.status(201).json({
                success: true,
                committee: {
                    id: newCommitteeId,
                    name, type, description,
                    createdAt: committeeRows[0].createdAt,
                    members
                }
            });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('API Error - POST /api/committees:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            client.release();
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
