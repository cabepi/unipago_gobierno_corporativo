import type { Request, Response } from 'express';
import { query } from '../src/data/db';
import multer from 'multer';
import { put } from '@vercel/blob';

export const config = {
    api: {
        bodyParser: false,
    },
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
}).single('icsFile');

export default async function handler(req: Request, res: Response) {
    if (req.method === 'POST') {
        return handlePost(req, res);
    }

    if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { rows } = await query(`
            SELECT 
                m.id, 
                m.type, 
                m.date, 
                m.time, 
                m.modality,
                m.location,
                m.ics_file_url as "icsFileUrl",
                m.status,
                c.name as "committeeName",
                json_build_object(
                    'name', u.name,
                    'role', cr.name,
                    'avatarUrl', u.avatar_url
                ) as secretary,
                (
                    SELECT json_agg(
                        json_build_object(
                            'userId', p.user_id,
                            'name', pu.name,
                            'avatarUrl', pu.avatar_url,
                            'status', p.status
                        )
                    )
                    FROM corporate_governance.meeting_participants p
                    JOIN corporate_governance.users pu ON p.user_id = pu.id
                    WHERE p.meeting_id = m.id
                ) as participants
            FROM corporate_governance.meetings m
            JOIN corporate_governance.committees c ON m.committee_id = c.id
            LEFT JOIN corporate_governance.committee_members cm ON c.id = cm.committee_id AND cm.role_code = 'SECRETARY'
            LEFT JOIN corporate_governance.committee_roles cr ON cm.role_code = cr.code
            LEFT JOIN corporate_governance.users u ON cm.user_id = u.id
            ORDER BY m.date ASC, m.time ASC
        `);

        // Format to match frontend MeetingData interface
        const formatted = rows.map(r => {
            // Determine meeting type string
            const typeStr = r.type === 'ORDINARY' ? 'Reunión Ordinaria' : 'Reunión Extraordinaria';

            // Format participants with fallback for empty
            const rawParticipants = r.participants || [];

            // Map statuses
            const statusMap: any = {
                'SCHEDULED': 'PENDIENTE',
                'AGENDA_SENT': 'PENDIENTE',
                'IN_PROGRESS': 'EN PROCESO',
                'PENDING_SIGNATURE': 'PENDIENTE FIRMA',
                'COMPLETED': 'FINALIZADA',
                'CANCELLED': 'CANCELADA'
            };

            const participantStatusMap: any = {
                'PENDING_SIGNATURE': 'PENDIENTE FIRMA',
                'PRESENT': 'PRESENTE',
                'ABSENT': 'AUSENTE'
            };

            return {
                id: r.id,
                type: typeStr,
                date: new Date(r.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
                time: r.time.substring(0, 5), // '10:00:00' -> '10:00'
                modality: r.modality,
                location: r.location,
                icsFileUrl: r.icsFileUrl,
                status: statusMap[r.status] || 'PENDIENTE',
                secretary: r.secretary ? {
                    name: r.secretary.name,
                    role: 'Secretario del Comité',
                    avatarUrl: r.secretary.avatarUrl
                } : null,
                participants: {
                    list: rawParticipants.map((p: any) => ({
                        url: p.avatarUrl,
                        name: p.name,
                        status: participantStatusMap[p.status]
                    })),
                    // Only show overflow label if more than 3
                    overflowLabel: rawParticipants.length > 3 ? `+${rawParticipants.length - 3}` : undefined,
                    overflowColorClass: 'bg-emerald-100 text-emerald-700 border-white'
                }
            };
        });

        return res.status(200).json(formatted);
    } catch (error) {
        console.error('API Error - GET /api/meetings:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function handlePost(req: Request, res: Response) {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Upload Error:', err);
            return res.status(500).json({ error: 'Error procesando el archivo' });
        }

        const { committeeId, date, time, modality, location, type } = req.body;
        const file = (req as any).file;

        if (!committeeId || !date || !time || !type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const { rows: insertedMeeting } = await query(`
                INSERT INTO corporate_governance.meetings (committee_id, type, date, time, modality, location, status)
                VALUES ($1, $2, $3, $4, $5, $6, 'SCHEDULED')
                RETURNING id
            `, [committeeId, type === 'Ordinaria' ? 'ORDINARY' : 'EXTRAORDINARY', date, time, modality || 'PRESENCIAL', location || null]);

            const newMeetingId = insertedMeeting[0].id;

            // Upload to Blob if file exists
            if (file && modality === 'VIRTUAL') {
                const originalName = file.originalname;
                if (originalName.endsWith('.ics')) {
                    const blobPath = `adjuntos-reuniones/${newMeetingId}/${originalName}`;
                    const blob = await put(blobPath, file.buffer, {
                        access: 'public',
                        token: process.env.BLOB_READ_WRITE_TOKEN
                    });

                    await query(`
                        UPDATE corporate_governance.meetings 
                        SET ics_file_url = $1 
                        WHERE id = $2
                    `, [blob.url, newMeetingId]);
                }
            }

            const { rows: members } = await query(`
                SELECT user_id FROM corporate_governance.committee_members
                WHERE committee_id = $1
            `, [committeeId]);

            if (members.length > 0) {
                const insertParticipants = `
                    INSERT INTO corporate_governance.meeting_participants (meeting_id, user_id, status)
                    VALUES ($1, $2, 'PRESENT')
                `;
                for (const member of members) {
                    await query(insertParticipants, [newMeetingId, member.user_id]);
                }
            }

            return res.status(201).json({ message: 'Meeting created successfully', id: newMeetingId });
        } catch (error) {
            console.error('API Error - POST /api/meetings:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
