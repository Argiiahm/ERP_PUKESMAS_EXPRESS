import { pool } from '../../../databases/connection.js';
import type { RefreshToken } from '../models/refreshToken.model.js';

export const insertRefreshToken = async (
    id: string,
    user_id: string,
    tokenHash: string,
    expired_at: Date
): Promise<RefreshToken | null> => {
    const result = await pool.query(
        `
            INSERT INTO refresh_tokens (
                id,
                user_id,
                tokenHash,
                expired_at
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
            id,
            user_id,
            tokenHash,
            expired_at,
            revoked_at,
            created_at    
        `,
        [id, user_id, tokenHash, expired_at]
    );

    return result.rows[0];
};
