import createHttpError from 'http-errors';
import type { UserRole } from '../utils/jwt.js';
import type { Request, Response, NextFunction } from 'express';

export const authorization =
    (...roles: UserRole[]) =>
    (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user.role) {
            return next(createHttpError.Unauthorized('Unauthorization'));
        }

        if (!roles.includes(req.user.role)) {
            return next(createHttpError.Forbidden('Access Denied'));
        }

        return next();
    };
