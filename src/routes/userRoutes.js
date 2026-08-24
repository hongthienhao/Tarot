import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getProfile, updateProfile, getMyTransactions } from '../controllers/userController.js';

const router = express.Router();

router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.get('/transactions', getMyTransactions);

export default router;
