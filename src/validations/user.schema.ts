import { z } from 'zod';

const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,11}$/;

export const ParamsIdSchema = z.object({
    id: z.string().uuid({ message: 'Invalid ID format. Must be a valid UUID.' }),
});

export const UserSchema = z.object({
    name: z.string().trim().min(1, 'Name Required').max(100, 'Name Maximum 100 Character'),
    email: z.string().trim().email('Invalid Email Format'),
    telp: z.string().trim().min(1, 'No telp is Required').regex(phoneRegex, {
        message: 'Invalid Indonesia Number. (example: 0821xxx or 622xxxx)',
    }),
    role: z.enum(['admin', 'doctor', 'nurse', 'staff']).default('staff'),
    password: z.string().min(8, 'Password Minimum 8 Character'),
});

export type ParamsIdInput = z.infer<typeof ParamsIdSchema>;
export type UserInput = z.infer<typeof UserSchema>;
