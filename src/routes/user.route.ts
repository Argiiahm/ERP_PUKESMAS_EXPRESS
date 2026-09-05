import { Router } from 'express';
import {
    HandleCreateUser,
    HandleDeleteUser,
    HandleUpdateUser,
    getUsers,
} from '../controllers/user.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';

const router = Router();

router.get('/admin/users', authentication, authorization('admin'), getUsers);
router.post('/admin/create/user', authentication, HandleCreateUser);
router.put('/admin/update/user/:id', authentication, HandleUpdateUser);
router.delete('/admin/delete/user/:id', authentication, HandleDeleteUser);

export default router;
