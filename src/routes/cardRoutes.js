import express from 'express';
import { drawCards } from '../controllers/cardController.js';

const router = express.Router();

/**
 * @swagger
 * /cards/draw:
 *   post:
 *     summary: Draw random Tarot cards
 *     description: Returns a set of unique random tarot cards with upright or reversed orientations.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               count:
 *                 type: integer
 *                 description: Number of cards to draw (1, 3, or 5)
 *                 example: 3
 *     responses:
 *       200:
 *         description: Successfully drawn cards
 *       400:
 *         description: Invalid input
 */
router.post('/draw', drawCards);

export default router;
