import jwt from 'jsonwebtoken';

// type UserRole
export type UserRole = 'admin' | 'doctor' | 'nurse' | 'staff';

// AccessTokenPayload
export interface AccessTokenPayload {
    user_id: string;
    email: string;
    role: UserRole;
}

// RefreshTokenPayload
interface RefreshTokenPayload {
    user_id: string;
    tokenId: string;
}

// Create AccessToken
export function CreateAccessToken(payload: AccessTokenPayload) {
    return jwt.sign(payload, process.env.ACCESS_KEY!, {
        expiresIn: '15m',
    });
}

// Create RefreshToken
export function CreateRefreshToken(payload: RefreshTokenPayload) {
    return jwt.sign(payload, process.env.REFRESH_KEY!, {
        expiresIn: '7d',
    });
}

// Verify AccessToken
export function VerifyAccessToken(tokenId: string) {
    return jwt.verify(tokenId, process.env.ACCESS_KEY!) as AccessTokenPayload;
}

// Verify RefreshToken
export function VerifyRefreshToken(tokenId: string) {
    return jwt.verify(tokenId, process.env.REFRESH_KEY!) as RefreshTokenPayload;
}
