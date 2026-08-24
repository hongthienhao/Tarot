import express from 'express';
import { getImage } from '../controllers/imageController.js';

const router = express.Router();

// GET /api/v1/images/:filename
router.get('/:filename', getImage);

export default router;
