import express from 'express';
import serviceValidator from '../validators/serviceValidator.mjs';
import { filterServices, getAllServices } from '../controllers/service.mjs';
import { verifyUser,verifyAdmin} from '../middlewares/authMiddleware.mjs';
import validateRequest from '../middlewares/validatorMiddleware.mjs';
import { createService } from '../controllers/admin.mjs';
const router = express.Router();

router.use(verifyUser);
// router.get('/',serviceValidator,getAllServices);
router.get('/',filterServices);
router.use(verifyAdmin);
router.post('/',serviceValidator,validateRequest,createService);
export default router;
