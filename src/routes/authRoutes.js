import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail,
  resetPassword,
} from '../controllers/authController.js';

import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
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

authRouter.post(
  '/auth/reset-password',
  celebrate({ [Segments.BODY]: resetPasswordSchema }),
  resetPassword,
);

authRouter.post(
  '/auth/request-reset-email',
  celebrate({ [Segments.BODY]: requestResetEmailSchema }),
  requestResetEmail,
);

export default authRouter;
