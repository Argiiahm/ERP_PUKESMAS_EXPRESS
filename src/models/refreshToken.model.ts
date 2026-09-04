export interface RefreshToken {
    id: string;
    tokenHash: string;
    user_id: string;
    expired_at: Date;
    revoked_at: Date;
    created_at: Date;
}
