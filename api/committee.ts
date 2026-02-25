import type { Request, Response } from 'express';
import { query } from '../src/data/db';

export default async function handler(req: Request, res: Response) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

    const { id } = req.query;
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Committee ID required' });

    try {
        // Fetch Committee Details & Members
        const { rows: committeeRows } = await query(`
            SELECT 
                c.id, c.name, c.type, c.description, c.created_at as "createdAt",
                COALESCE(
                    json_agg(
                        json_build_object(
                            'userId', cm.user_id,
                            'roleCode', cm.role_code,
                            'roleName', cr.name,
                            'userName', u.name,
                            'userAvatar', u.avatar_url,
                            'isExternal', u.is_external
                        )
                    ) FILTER (WHERE cm.user_id IS NOT NULL), 
                '[]') as members
            FROM corporate_governance.committees c
            LEFT JOIN corporate_governance.committee_members cm ON c.id = cm.committee_id
            LEFT JOIN corporate_governance.users u ON cm.user_id = u.id
            LEFT JOIN corporate_governance.committee_roles cr ON cm.role_code = cr.code
            WHERE c.id = $1
            GROUP BY c.id
        `, [id]);

        if (committeeRows.length === 0) return res.status(404).json({ error: 'Committee not found' });

        const r = committeeRows[0];
        const formattedCommittee = {
            id: r.id,
            name: r.name,
            type: r.type === 'INTERNAL' ? 'Interno' : 'Externo',
            description: r.description,
            createdAt: r.createdAt,
            members: r.members.map((m: any) => ({
                userId: m.userId,
                role: m.roleName,
                user: { name: m.userName, avatarUrl: m.userAvatar, isExternal: m.isExternal }
            }))
        };

        // Fetch Meetings for this committee
        const { rows: meetingRows } = await query(`
            SELECT 
                m.id, 
                m.type, 
                m.date, 
                m.time, 
                m.modality,
                m.location,
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
            WHERE m.committee_id = $1
            ORDER BY m.date ASC, m.time ASC
        `, [id]);

        // Format Meetings
        const formattedMeetings = meetingRows.map(mr => {
            const typeStr = mr.type === 'ORDINARY' ? 'Reunión Ordinaria' : 'Reunión Extraordinaria';
            const rawParticipants = mr.participants || [];

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
                id: mr.id,
                type: typeStr,
                date: new Date(mr.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
                time: mr.time.substring(0, 5),
                modality: mr.modality,
                location: mr.location,
                status: statusMap[mr.status] || 'PENDIENTE',
                secretary: mr.secretary ? {
                    name: mr.secretary.name,
                    role: 'Secretario del Comité',
                    avatarUrl: mr.secretary.avatarUrl
                } : null,
                participants: {
                    list: rawParticipants.map((p: any) => ({
                        url: p.avatarUrl,
                        name: p.name,
                        status: participantStatusMap[p.status]
                    })),
                    overflowLabel: rawParticipants.length > 3 ? `+${rawParticipants.length - 3}` : undefined,
                    overflowColorClass: 'bg-emerald-100 text-emerald-700 border-white'
                }
            };
        });

        return res.status(200).json({
            ...formattedCommittee,
            meetings: formattedMeetings
        });

    } catch (error) {
        console.error('API Error - GET /api/committee:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
