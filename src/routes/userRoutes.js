import { Router } from 'express';
import { updateUserAvatar } from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';

const router = Router();

router.patch(
  '/user/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);
export default router;
