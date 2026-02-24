import { query } from './db';
import type { User } from '../domain/User';

export class UserRepository {
    static async findByEmail(email: string): Promise<User | null> {
        const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length === 0) return null;
        return rows[0] as User;
    }

    static async findById(id: string): Promise<User | null> {
        const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
        if (rows.length === 0) return null;
        return rows[0] as User;
    }
}
