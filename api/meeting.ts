import type { Request, Response } from 'express';
import { query } from '../src/data/db';

export default async function handler(req: Request, res: Response) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

    const { id } = req.query;
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Meeting ID required' });

    try {
        // Fetch Main Meeting
        const { rows: meetingRows } = await query(`
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
                ) as secretary
            FROM corporate_governance.meetings m
            JOIN corporate_governance.committees c ON m.committee_id = c.id
            LEFT JOIN corporate_governance.committee_members cm ON c.id = cm.committee_id AND cm.role = 'SECRETARY'
            LEFT JOIN corporate_governance.users u ON cm.user_id = u.id
            WHERE m.id = $1
        `, [id]);

        if (meetingRows.length === 0) return res.status(404).json({ error: 'Meeting not found' });
        const r = meetingRows[0];

        // Fetch Participants
        const { rows: participantRows } = await query(`
            SELECT 
                p.user_id as "id",
                u.name,
                u.avatar_url as "avatarUrl",
                p.status
            FROM corporate_governance.meeting_participants p
            JOIN corporate_governance.users u ON p.user_id = u.id
            WHERE p.meeting_id = $1
        `, [id]);

        // Fetch Documents
        const { rows: documentRows } = await query(`
            SELECT id, name, type, category, url, upload_date as "uploadDate"
            FROM corporate_governance.documents
            WHERE meeting_id = $1
            ORDER BY upload_date ASC
        `, [id]);

        // Fetch Agenda
        const { rows: agendaRows } = await query(`
            SELECT id, topic_title as title, duration_minutes as "durationMinutes"
            FROM corporate_governance.agenda_topics
            WHERE meeting_id = $1
            ORDER BY order_index ASC
        `, [id]);

        // Fetch Comments
        const { rows: commentsRows } = await query(`
            SELECT 
                mc.id, 
                mc.comment, 
                mc.created_at as "createdAt",
                u.name as "authorName",
                u.avatar_url as "authorAvatar"
            FROM corporate_governance.meeting_comments mc
            JOIN corporate_governance.users u ON mc.user_id = u.id
            WHERE mc.meeting_id = $1
            ORDER BY mc.created_at ASC
        `, [id]);

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

        const typeStr = r.type === 'ORDINARY' ? 'Reunión Ordinaria' : 'Reunión Extraordinaria';

        const result = {
            id: r.id,
            type: typeStr,
            date: new Date(r.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
            time: r.time.substring(0, 5),
            location: r.location,
            status: statusMap[r.status] || 'PENDIENTE',
            secretary: {
                name: r.secretary.name,
                role: 'Secretario del Comité',
                avatarUrl: r.secretary.avatarUrl
            },
            agenda: agendaRows,
            comments: commentsRows.map(c => ({
                id: c.id,
                authorName: c.authorName,
                authorAvatar: c.authorAvatar,
                comment: c.comment,
                date: new Date(c.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
            })),
            participantsList: participantRows.map(p => ({
                id: p.id,
                name: p.name,
                avatarUrl: p.avatarUrl,
                status: participantStatusMap[p.status]
            })),
            documents: documentRows.map(d => ({
                id: d.id,
                name: d.name,
                type: d.type,
                category: d.category,
                url: d.url,
                date: new Date(d.uploadDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
            }))
        };

        return res.status(200).json(result);
    } catch (error) {
        console.error('API Error - GET /api/meeting:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
