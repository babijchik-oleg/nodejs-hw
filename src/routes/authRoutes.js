import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../controllers/authController.js';

import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';

const authRouter = Router();

authRouter.post(
  '/auth/register',
  celebrate({ [Segments.BODY]: registerUserSchema }),
  registerUser,
);

authRouter.post(
  '/auth/login',
  celebrate({ [Segments.BODY]: loginUserSchema }),
  loginUser,
);

authRouter.post('/auth/refresh', refreshUserSession);

authRouter.post('/auth/logout', logoutUser);

export default authRouter;
