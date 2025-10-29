import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { register, login, googleLogin, me, updateProfile, changePassword, logout } from '../controllers/auth.controller.js';
import {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  updateProfileSchema,
  changePasswordSchema
} from '../validators/auth.validator.js';

export const registerRouter = Router();

registerRouter.post('/register', validate(registerSchema), register);
registerRouter.post('/login', validate(loginSchema), login);
registerRouter.post('/auth/google', validate(googleLoginSchema), googleLogin);
registerRouter.post('/logout', logout);

registerRouter.get('/profile', requireAuth, me);
registerRouter.put('/profile', requireAuth, validate(updateProfileSchema), updateProfile);
registerRouter.put('/profile/password', requireAuth, validate(changePasswordSchema), changePassword);


