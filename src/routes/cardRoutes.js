import express from 'express';
import rateLimit from 'express-rate-limit';
import { drawCards, generateReading, getAllCards } from '../controllers/cardController.js';
import { protect, optionalProtect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rate limiter đặc biệt cho draw: 10 req/phút
const drawLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Bạn rút bài quá nhanh. Vui lòng chờ một chút trước khi tiếp tục.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Fetch all Tarot cards
 *     description: Returns the entire set of 78 Tarot cards, structured for definitions/dictionary.
 *     responses:
 *       200:
 *         description: Successfully fetched all cards
 */
router.get('/', getAllCards);

/**
 * @swagger
 * /cards/draw:
 *   post:
 *     summary: Draw random Tarot cards
 *     description: |
 *       - isDaily=true: Free draw, auto check-in if logged in
 *       - isDaily=false: Requires auth, costs 1 Tinh Tú (atomic)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *               isDaily:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Successfully drawn cards
 *       400:
 *         description: INSUFFICIENT_STAR_POINTS or invalid input
 */
router.post('/draw', drawLimiter, protect, drawCards);

/**
 * @swagger
 * /cards/ai-reading:
 *   post:
 *     summary: Get AI Tarot reading (Streamed via SSE)
 */
router.post('/ai-reading', optionalProtect, generateReading);

export default router;
