import type { Request, Response } from 'express';
import { query } from '../src/data/db';

export default async function handler(req: Request, res: Response) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { rows } = await query(`
            SELECT 
                m.id, 
                m.type, 
                m.date, 
                m.time, 
                m.location,
                m.status,
                c.name as "committeeName",
                json_build_object(
                    'name', u.name,
                    'role', cm.role,
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
            LEFT JOIN corporate_governance.committee_members cm ON c.id = cm.committee_id AND cm.role = 'SECRETARY'
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
                location: r.location,
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
