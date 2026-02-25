import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import loginHandler from '../../api/login';
import proxyHandler from '../../api/proxy';
import usersHandler from '../../api/users';
import committeesHandler from '../../api/committees';
import { default as singleCommitteeHandler } from '../../api/committee';
import meetingsHandler from '../../api/meetings';
import meetingHandler from '../../api/meeting';
import meetingCommentsHandler from '../../api/meeting_comments';
import signaturesHandler from '../../api/signatures';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Emulate Vercel Serverless Function behavior locally
app.post('/api/login', loginHandler);
app.all('/api/proxy', proxyHandler);

// Corporate Governance APIs (Without auth middleware for now to ease local testing, but ideally should be protected)
app.get('/api/users', usersHandler);
app.all('/api/committees', committeesHandler);
app.get('/api/committee', singleCommitteeHandler);
app.get('/api/meetings', meetingsHandler);
app.get('/api/meeting', meetingHandler); // uses ?id=...
app.post('/api/meeting/comments', meetingCommentsHandler);
app.post('/api/signatures', signaturesHandler);

// Simple JWT Verification Middleware
export const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err: any, user: any) => {
        if (err) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        (req as any).user = user;
        next();
    });
};

// Example protected route for development
app.get('/api/me', authenticateToken, (req, res) => {
    res.json({ message: 'Success', user: (req as any).user });
});

app.listen(PORT, () => {
    console.log(`Development Express Server proxying /api running on http://localhost:${PORT}`);
});
