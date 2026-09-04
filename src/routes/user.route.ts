import { Router } from 'express';
import {
    HandleCreateUser,
    HandleDeleteUser,
    HandleUpdateUser,
    getUsers,
} from '../controllers/user.controller.js';

const router = Router();

router.get('/admin/users', getUsers);
router.post('/admin/create/user', HandleCreateUser);
router.put('/admin/update/user/:id', HandleUpdateUser);
router.delete('/admin/delete/user/:id', HandleDeleteUser);

export default router;
