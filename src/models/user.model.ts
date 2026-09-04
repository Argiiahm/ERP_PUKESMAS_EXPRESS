// type UserRole
type UserRole = 'admin' | 'doctor' | 'nurse' | 'staff';
export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    telp: string;
    role: UserRole;
    password: string;
    created_at: Date;
    updated_at: Date;
}
