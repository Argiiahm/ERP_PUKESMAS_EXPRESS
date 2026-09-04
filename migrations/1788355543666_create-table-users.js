/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.sql(
        `
        CREATE EXTENSION IF NOT EXISTS pgcrypto;
        
        CREATE TYPE user_role as ENUM (
            'admin',
            'doctor',
            'nurse',
            'staff'
        );

        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
            name VARCHAR(100) NOT NULL, 
            email VARCHAR(255) NOT NULL UNIQUE,
            telp VARCHAR(20) NOT NULL UNIQUE,
            role user_role NOT NULL DEFAULT 'staff',
            password TEXT NOT NULL, 
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`
        DROP TABLE IF EXISTS users;
        DROP TYPE IF EXISTS user_role;
    `);
};
