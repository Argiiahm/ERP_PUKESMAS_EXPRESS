import {
    createUser,
    deleteUser,
    findUserByEmail,
    findUserById,
    findUserByTelp,
    findUsers,
    updateUser,
} from '../repositories/user.repository.js';
import bcrypt from 'bcrypt';
import type { UserInput } from '../validations/user.schema.js';
import createHttpError from 'http-errors';

// GET Users
export const getUsers = async () => {
    return await findUsers();
};

// CREATE User
export const HandleCreateUser = async (data: UserInput) => {
    // Check Already Email & Telp
    const [existEmail, existTelp] = await Promise.all([
        findUserByEmail(data.email),
        findUserByTelp(data.telp),
    ]);

    if (existEmail) {
        throw createHttpError.Conflict('Email Already Registered');
    }

    if (existTelp) {
        throw createHttpError.Conflict('Telp Already Registered');
    }

    // Hash Password
    const hashPassword = await bcrypt.hash(data.password, 10);

    // CreateUser
    const result = await createUser(data.name, data.email, data.telp, data.role, hashPassword);

    return result;
};

// UPDATE User
export const handleUpdateUser = async (data: UserInput, id: string) => {
    // GET userById
    const user = await findUserById(id);
    if (!user) {
        throw createHttpError.NotFound('User Not Found');
    }

    let password = user.password;
    if (data.password) {
        password = await bcrypt.hash(data.password, 10);
    }

    // Update User
    const result = await updateUser(data.name, data.email, data.telp, data.role, password, user.id);

    return result;
};

// DELETE User
export const handleDeleteUser = async (id: string) => {
    // GET userById
    const user = await findUserById(id);
    if (!user) {
        throw createHttpError.NotFound('User Not Found');
    }
    await deleteUser(id);
    return;
};
