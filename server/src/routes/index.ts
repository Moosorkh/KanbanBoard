import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// TODO: Add authentication to the API routes
router.use('/auth', authRoutes);
router.use('/api', apiRoutes, authenticateToken);

export default router;
