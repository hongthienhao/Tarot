import express from 'express';
import { drawCards, generateReading } from '../controllers/cardController.js';

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

/**
 * @swagger
 * /cards/ai-reading:
 *   post:
 *     summary: Get AI Tarot reading (Streamed via SSE)
 *     description: Returns a streaming text response from the AI acting as a Tarot Master.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spreadType:
 *                 type: string
 *               userQuestion:
 *                 type: string
 *               cards:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Server-Sent Events stream
 */
router.post('/ai-reading', generateReading);

export default router;
