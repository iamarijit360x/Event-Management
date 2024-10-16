import express from 'express';
import validateRequest from '../middlewares/validatorMiddleware.mjs';
import { verifyAdmin, verifyUser } from '../middlewares/authMiddleware.mjs';
import { createBooking, getUserBookings } from '../controllers/booking.mjs';
import { bookingValidator } from '../validators/bookingValidator.mjs';
const router = express.Router();
router.use(verifyUser);

router.post('/',bookingValidator,validateRequest,createBooking);
router.get('/',getUserBookings);
// router.use(verifyAdmin);

export default router;
