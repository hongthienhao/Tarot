import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getUserReadings, saveReading } from '../controllers/readingController.js';

const router = express.Router();

router.use(protect); // Protect all reading routes

router.route('/')
  .get(getUserReadings)
  .post(saveReading);

export default router;
