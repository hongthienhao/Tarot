import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getUserReadings, saveReading, deleteReading, deleteMultipleReadings } from '../controllers/readingController.js';

const router = express.Router();

router.use(protect); // Protect all reading routes

/**
 * @swagger
 * /readings:
 *   get:
 *     summary: Get all readings for the authenticated user
 *     description: Returns a list of readings ordered by creation date descending.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved readings
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Save a new reading
 *     description: Create a new Tarot reading session in the chronicles.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spreadName:
 *                 type: string
 *               userQuestion:
 *                 type: string
 *               interpretation:
 *                 type: string
 *               notes:
 *                 type: string
 *               cards:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Successfully saved reading
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete multiple readings
 *     description: Deletes an array of readings by their IDs for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["uuid-1", "uuid-2"]
 *     responses:
 *       200:
 *         description: Successfully deleted multiple readings
 *       400:
 *         description: Invalid request body (missing ids)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No valid readings found
 */
router.route('/')
  .get(getUserReadings)
  .post(saveReading)
  .delete(deleteMultipleReadings);

/**
 * @swagger
 * /readings/delete-multiple:
 *   post:
 *     summary: Delete multiple readings
 *     description: Deletes an array of readings by their IDs for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["uuid-1", "uuid-2"]
 *     responses:
 *       200:
 *         description: Successfully deleted multiple readings
 *       400:
 *         description: Invalid request body (missing ids)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No valid readings found
 */
router.route('/delete-multiple')
  .post(deleteMultipleReadings);

/**
 * @swagger
 * /readings/{id}:
 *   delete:
 *     summary: Delete a single reading
 *     description: Deletes a specific reading by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reading ID
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Reading not found
 */
router.route('/:id')
  .delete(deleteReading);

export default router;
