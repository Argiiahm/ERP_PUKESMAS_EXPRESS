import { pool } from '../databases/connection.js';
import type { User } from '../models/user.model.js';

// GET Users
export const findUsers = async (): Promise<User[]> => {
    const result = await pool.query<User>(
        `
            SELECT id,name,email,telp,role FROM users
        `
    );
    return result.rows;
};

// GET UserById
export const findUserById = async (id: string): Promise<User | null> => {
    const result = await pool.query<User>(
        `
            SELECT id,name,email,telp,role,password,created_at,updated_at
            FROM users WHERE id = $1
        `,
        // [id] itu array yang berisi nilai untuk $1.
        [id]
    );
    return result.rows[0] ?? null;
};

// GET UserByEmail
export const findUserByEmail = async (email: string): Promise<User | null> => {
    const result = await pool.query<User>(
        `
            SELECT id,name,email,telp,role,password,created_at,updated_at
            FROM users WHERE email = $1
        `,
        // [email] itu array yang berisi nilai untuk $1.
        [email]
    );
    return result.rows[0] ?? null;
};

// GET UserByTelp
export const findUserByTelp = async (telp: string): Promise<User | null> => {
    const result = await pool.query<User>(
        `
            SELECT id,name,email,telp,role,password,created_at,updated_at
            FROM users WHERE telp = $1
        `,
        // [email] itu array yang berisi nilai untuk $1.
        [telp]
    );
    return result.rows[0] ?? null;
};

// CREATE User
export const createUser = async (
    name: string,
    email: string,
    telp: string,
    role: string,
    password: string
): Promise<User | null> => {
    const result = await pool.query(
        `
            INSERT INTO users (name, email, telp, role, password) VALUES  ($1, $2, $3, $4, $5)
            RETURNING id,name,email,telp,role,created_at,updated_at
        `,
        [name, email, telp, role, password]
    );
    return result.rows[0] ?? null;
};

// UPDATE User
export const updateUser = async (
    name: string,
    email: string,
    telp: string,
    role: string,
    password: string,
    id: string
): Promise<User | null> => {
    const result = await pool.query(
        `
            UPDATE users SET name = $1, email = $2, telp = $3, role = $4, password = $5 
            WHERE id = $6
            RETURNING id,name,email,telp,role,created_at,updated_at
        `,
        [name, email, telp, role, password, id]
    );

    return result.rows[0] ?? null;
};

// DELETE User
export const deleteUser = async (id: string) => {
    await pool.query<User>(
        `
            DELETE FROM users WHERE id = $1
        `,
        [id]
    );

    return;
};
