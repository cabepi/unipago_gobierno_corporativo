import type { Request, Response } from 'express';
import multer from 'multer';
import { put } from '@vercel/blob';
import pool from '../src/data/db';

export const config = {
    api: {
        bodyParser: false,
    },
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).single('file');

export default async function handler(req: Request, res: Response) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    upload(req, res, async (err) => {
        if (err) {
            console.error('Upload Error:', err);
            return res.status(500).json({ error: 'Error procesando el archivo adjunto' });
        }

        const file = (req as any).file;
        const meetingId = req.body.meetingId;
        const userId = req.body.userId; // En un escenario real vendría del auth token
        const category = req.body.category || 'SUPPORT_DOC';

        if (!file || !meetingId || !userId) {
            return res.status(400).json({ error: 'Faltan campos requeridos (file, meetingId, userId)' });
        }

        const client = await pool.connect();

        try {
            // 1. Validar Roles: Identificar el comité de esta reunión y los roles del usuario allí.
            const meetingRes = await client.query('SELECT committee_id FROM corporate_governance.meetings WHERE id = $1', [meetingId]);
            if (meetingRes.rows.length === 0) {
                return res.status(404).json({ error: 'Reunión no encontrada' });
            }

            const committeeId = meetingRes.rows[0].committee_id;

            const roleRes = await client.query(`
                SELECT role_code FROM corporate_governance.committee_members 
                WHERE committee_id = $1 AND user_id = $2
            `, [committeeId, userId]);

            if (roleRes.rows.length === 0) {
                return res.status(403).json({ error: 'Acceso Denegado: No perteneces a este comité' });
            }

            const role = roleRes.rows[0].role_code;
            if (role !== 'SECRETARY' && role !== 'SUPPORT') {
                return res.status(403).json({ error: 'Acceso Denegado: Solo SECRETARY o SUPPORT pueden adjuntar documentos.' });
            }

            // 2. Extraer extensión e identificar tipo admitido
            const originalName = file.originalname;
            const ext = originalName.split('.').pop()?.toUpperCase() || '';
            const validTypes = ['PPTX', 'PDF', 'DOCX', 'PNG', 'JPG', 'JPEG'];

            if (!validTypes.includes(ext)) {
                return res.status(400).json({ error: `Tipo de archivo no válido. Extensiones permitidas: ${validTypes.join(', ')}` });
            }

            // 3. Subir a Vercel Blob
            const blobPath = `adjuntos-reuniones/${meetingId}/${originalName}`;

            // Requerimos el string exacto si el ENV se carga raro o dependemos de la inicialización de BLOB_READ_WRITE_TOKEN
            const blob = await put(blobPath, file.buffer, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN
            });

            // 4. Guardar archivo en Base de Datos
            const { rows } = await client.query(`
                INSERT INTO corporate_governance.documents (meeting_id, name, type, category, url)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `, [meetingId, originalName, ext, category, blob.url]);

            return res.status(200).json({
                success: true,
                message: 'Archivo subido y registrado exitosamente.',
                document: rows[0]
            });

        } catch (error) {
            console.error('API Error - POST /api/documents:', error);
            return res.status(500).json({ error: 'Error del Servidor Interno' });
        } finally {
            client.release();
        }
    });
}
