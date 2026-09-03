import { pool } from '../../../databases/connection.js';
import type { User } from '../models/user.model.js';

// Login
export const findUserByEmail = async (email: string): Promise<User | null> => {
    const result = await pool.query<User>(
        `
            SELECT id,
                   name, 
                   username,
                   email,
                   telp,
                   role,
                   password,
                   created_at,
                   updated_at
            FROM users
            WHERE email = $1
        `,
        // [email] itu array yang berisi nilai untuk $1.
        [email]
    );
    return result.rows[0] ?? null;
};
