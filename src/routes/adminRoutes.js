import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/adminMiddleware.js';
import {
  getStats,
  getUsers,
  adjustStars,
  toggleBan,
  deleteUser,
  getBlacklist,
  addToBlacklist,
  removeFromBlacklist,
  getTransactions,
  getStarSummaries,
} from '../controllers/adminController.js';

const router = express.Router();

// Tất cả admin routes: đăng nhập + ADMIN role
router.use(protect, requireAdmin);

// Stats
router.get('/stats', getStats);

// Users
router.get('/users', getUsers);
router.patch('/users/:id/stars', adjustStars);
router.patch('/users/:id/ban', toggleBan);
router.delete('/users/:id', deleteUser);

// Blacklist
router.get('/blacklist', getBlacklist);
router.post('/blacklist', addToBlacklist);
router.delete('/blacklist/:id', removeFromBlacklist);

// Transactions & Star Summaries
router.get('/transactions', getTransactions);
router.get('/star-summaries', getStarSummaries);

export default router;
