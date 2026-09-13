import { Router } from 'express';
import { updateUserAvatar } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.patch(
  '/user/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);
export default router;
