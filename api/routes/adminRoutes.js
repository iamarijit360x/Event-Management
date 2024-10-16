import express from 'express';
import validateRequest from '../middlewares/validatorMiddleware.mjs';
import serviceValidator from '../validators/serviceValidator.mjs';
import { createService } from '../controllers/admin.mjs';
import { verifyAdmin, verifyUser } from '../middlewares/authMiddleware.mjs';
const router = express.Router();
router.use(verifyUser);
router.use(verifyAdmin);
router.post('/create-service',serviceValidator,validateRequest,createService);

export default router;
