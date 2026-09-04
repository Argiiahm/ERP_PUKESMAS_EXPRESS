import * as UserService from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { Request, Response } from 'express';
import { ParamsIdSchema, UserSchema } from '../validations/user.schema.js';

// GET Users
export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
    const result = await UserService.getUsers();
    return res.status(200).json({
        success: true,
        message: 'Successfully Get Users.',
        data: result,
    });
});

// CREATE User
export const HandleCreateUser = asyncHandler(async (req: Request, res: Response) => {
    // Validate with zod
    const validateData = UserSchema.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({
            success: false,
            errors: validateData.error.flatten(),
        });
    }

    const result = await UserService.HandleCreateUser(validateData.data);
    return res.status(201).json({
        success: true,
        message: 'Successfully Created User.',
        data: result,
    });
});

// UPDATE User
export const HandleUpdateUser = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
        // Validate Params UUID
        const validateParamsUuid = ParamsIdSchema.safeParse(req.params);
        if (!validateParamsUuid.success) {
            return res.status(400).json({
                success: false,
                errors: validateParamsUuid.error.flatten(),
            });
        }

        // Validate with zod
        const validateData = UserSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        const result = await UserService.handleUpdateUser(
            validateData.data,
            validateParamsUuid.data.id
        );
        return res.status(200).json({
            success: true,
            message: 'Successfully Updated User.',
            data: result,
        });
    }
);

// DELETE User
export const HandleDeleteUser = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
        const validateData = ParamsIdSchema.safeParse(req.params);

        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        await UserService.handleDeleteUser(validateData.data.id);

        return res.status(200).json({
            success: true,
            message: 'Successfully Deleted User.',
        });
    }
);
