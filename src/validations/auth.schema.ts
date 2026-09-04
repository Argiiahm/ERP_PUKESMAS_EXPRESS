import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().trim().email('Invalid Email Format'),
    password: z.string().trim().min(8, 'Password Minimum 8 Character'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
