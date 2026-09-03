import bcrypt from 'bcrypt';
import { findUserByEmail } from '../repositories/auth.repository.js';
import type { LoginInput } from '../validations/auth.schema.js';
import createHttpError from 'http-errors';
import { CreateAccessToken, CreateRefreshToken } from '../../../utils/jwt.js';
import { insertRefreshToken } from '../repositories/refreshToken.repository.js';

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
