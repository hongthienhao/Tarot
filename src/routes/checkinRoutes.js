import express from 'express';
import { dailyCheckin, getCheckinStatus } from '../controllers/checkinController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Tất cả routes checkin đều yêu cầu đăng nhập
router.use(protect);

/**
 * POST /api/v1/checkin
 * Điểm danh hàng ngày, nhận thưởng Tinh Tú
 */
router.post('/', dailyCheckin);

/**
 * GET /api/v1/checkin/status
 * Trạng thái điểm danh hôm nay + tiến trình tuần
 */
router.get('/status', getCheckinStatus);

export default router;
