import * as AuthService from '../services/auth.service.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import type { Request, Response } from 'express';
import { LoginSchema, type LoginInput } from '../validations/auth.schema.js';
import { cookieOptions } from '../../../constants/cookie.js';

// Login
export const login = asyncHandler(
    async (req: Request<object, object, LoginInput>, res: Response) => {
        const validateData = LoginSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        const result = await AuthService.login(validateData.data);
        res.cookie('refreshToken', result.RefreshToken, cookieOptions);

        return res.status(200).json({
            success: true,
            message: 'Successfully Login',
            data: {
                accessToken: result.AccessToken,
            },
        });
    }
);
