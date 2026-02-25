import type { Request, Response } from 'express';
import { query } from '../src/data/db.js';

export default async function handler(req: Request, res: Response) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { meetingId, userId, comment } = req.body;

    if (!meetingId || !userId || !comment) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await query(`
            INSERT INTO corporate_governance.meeting_comments (meeting_id, user_id, comment)
            VALUES ($1, $2, $3)
        `, [meetingId, userId, comment]);

        return res.status(201).json({ success: true });
    } catch (error) {
        console.error('API Error - POST /api/meeting/comments:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
