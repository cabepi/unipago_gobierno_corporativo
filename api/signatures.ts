import type { Request, Response } from 'express';
import pool from '../src/data/db';

export default async function handler(req: Request, res: Response) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const client = await pool.connect();
    try {
        const { documentId, userId, signatureBase64 } = req.body;
        if (!documentId || !userId || !signatureBase64) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        await client.query('BEGIN');

        // 1. Insert signature
        await client.query(`
            INSERT INTO corporate_governance.signatures (document_id, user_id, signature_base64)
            VALUES ($1, $2, $3)
            ON CONFLICT (document_id, user_id) DO UPDATE SET
            signature_base64 = EXCLUDED.signature_base64,
            signed_at = (now() AT TIME ZONE 'America/Santo_Domingo')
        `, [documentId, userId, signatureBase64]);

        // 2. Automatically update the participant status if everything is signed (Simulated)
        // Here we just mark as PRESENT if they signed this particular doc, just as a placeholder logic
        // Real logic would check if all documents are signed
        await client.query(`
            UPDATE corporate_governance.meeting_participants
            SET status = 'PRESENT'
            WHERE user_id = $1 AND meeting_id = (
                SELECT meeting_id FROM corporate_governance.documents WHERE id = $2
            )
        `, [userId, documentId]);

        await client.query('COMMIT');

        return res.status(200).json({ success: true, message: 'Firma guardada exitosamente' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('API Error - POST /api/signatures:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}
