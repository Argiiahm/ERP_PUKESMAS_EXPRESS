import { pool } from '../databases/connection.js';
import type { RefreshToken } from '../models/refreshToken.model.js';

// Insert RefreshToken
export const insertRefreshToken = async (
    id: string,
    user_id: string,
    token_hash: string,
    expired_at: Date
): Promise<RefreshToken | null> => {
    const result = await pool.query(
        `
            INSERT INTO refresh_tokens (
                id,
                user_id,
                token_hash,
                expired_at
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
            id,
            user_id,
            token_hash,
            expired_at,
            revoked_at,
            created_at    
        `,
        [id, user_id, token_hash, expired_at]
    );

    return result.rows[0];
};

// Get refreshToken ById
export const findRefreshTokenById = async (id: string) => {
    const result = await pool.query(
        `
            SELECT 
                rt.id,
                rt.user_id,
                rt.token_hash,
                rt.expired_at,
                rt.revoked_at,

                u.id,
                u.name,
                u.email,
                u.telp,
                u.role

            FROM refresh_tokens AS rt
            INNER JOIN users AS u ON rt.user_id = u.id
            WHERE rt.id = $1
        `,
        [id]
    );
    return result.rows[0] ?? null;
};

// Update RefreshToken
export const updateRefreshToken = async (revoked_at: Date, id: string) => {
    const result = await pool.query(
        `UPDATE refresh_tokens SET revoked_at  = $1
         WHERE id = $2
        `,
        [revoked_at, id]
    );
    return result.rows[0];
};
