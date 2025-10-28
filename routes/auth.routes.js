import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { register, login, me, updateProfile, changePassword, logout } from '../controllers/auth.controller.js';

export const registerRouter = Router();

registerRouter.post('/register', register);
registerRouter.post('/login', login);
registerRouter.post('/logout', logout);
registerRouter.get('/profile', requireAuth, me);
registerRouter.put('/profile', requireAuth, updateProfile);
registerRouter.put('/profile/password', requireAuth, changePassword);


