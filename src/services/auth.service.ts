import bcrypt from 'bcrypt';
import { findUserByEmail } from '../repositories/auth.repository.js';
import type { LoginInput } from '../validations/auth.schema.js';
import createHttpError from 'http-errors';
import { CreateAccessToken, CreateRefreshToken, VerifyRefreshToken } from '../utils/jwt.js';
import {
    findRefreshTokenById,
    insertRefreshToken,
    updateRefreshToken,
} from '../repositories/refreshToken.repository.js';

export const login = async (data: LoginInput) => {
    // get method FindUser from Repository
    const user = await findUserByEmail(data.email);
    // Check, is user already registered?
    if (!user) {
        throw createHttpError.Unauthorized('Invalid Credentials');
    }

    // Compare the password
    const comparePassword = await bcrypt.compare(data.password, user.password);
    // is same?
    if (!comparePassword) {
        throw createHttpError.Unauthorized('Invalid Credentials');
    }

    // generate Random Token for TokenId
    const tokenId = crypto.randomUUID();

    // Payload AccessToken
    const AccessToken = CreateAccessToken({
        user_id: user.id,
        email: user.email,
        role: user.role,
    });

    // Payload RefreshToken
    const RefreshToken = CreateRefreshToken({
        user_id: user.id,
        tokenId: tokenId,
    });

    // Hashing RefreshToken
    const tokenHash = await bcrypt.hash(RefreshToken, 10);
    // Set Expires
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Day

    // Insert to Table refresh_tokens
    await insertRefreshToken(tokenId, user.id, tokenHash, expiresAt);

    return {
        AccessToken,
        RefreshToken,
    };
};

// Refresh
export const refresh = async (refreshToken: string) => {
    if (!refreshToken) {
        throw createHttpError.Unauthorized('Unauthorization');
    }

    // Verify RefreshToken
    const payload = await VerifyRefreshToken(refreshToken);

    // Get All RefreshTokens Data,
    // Check All, is valid?
    // Generate New AccessTokens

    const session = await findRefreshTokenById(payload.tokenId);

    if (!session) {
        throw createHttpError.Unauthorized('Invalid RefreshToken');
    }

    if (session.expired_at < new Date()) {
        throw createHttpError.Unauthorized('RefreshToken Expires');
    }

    if (session.revoked_at) {
        throw createHttpError.Unauthorized('RefreshToken Revoked.');
    }

    // Compare
    const compare = await bcrypt.compare(refreshToken, session.token_hash);
    if (!compare) {
        throw createHttpError.Unauthorized('Invalid RefreshToken');
    }

    // Generate New AccessToken
    const accessToken = CreateAccessToken({
        user_id: session.user_id,
        email: session.email,
        role: session.role,
    });

    return {
        accessToken,
    };
};

// Logout
export const logout = async (refreshToken: string) => {
    if (!refreshToken) {
        throw createHttpError.Unauthorized('Unauthorization');
    }

    // Verify RefreshToken
    const payload = await VerifyRefreshToken(refreshToken);

    // Get All RefreshTokens Data,
    // Check All, is valid?
    // Generate New AccessTokens

    const session = await findRefreshTokenById(payload.tokenId);

    if (!session) {
        throw createHttpError.Unauthorized('Invalid RefreshToken');
    }

    if (session.expired_at < new Date()) {
        throw createHttpError.Unauthorized('RefreshToken Expires');
    }

    if (session.revoked_at) {
        throw createHttpError.Unauthorized('RefreshToken Revoked.');
    }

    const revoked_at = new Date();
    await updateRefreshToken(revoked_at, session.id);

    return;
};
