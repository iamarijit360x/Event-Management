const express = require('express');
const validateRequest = require('../middlewares/validatorMiddleware');
const { verifyAdmin, verifyUser } = require('../middlewares/authMiddleware');
const { createBooking, getUserBookings } = require('../controllers/booking');
const { bookingValidator } = require('../validators/bookingValidator');

const router = express.Router();

router.use(verifyUser);

router.post('/', bookingValidator, validateRequest, createBooking);
router.get('/', getUserBookings);
// router.use(verifyAdmin);

module.exports = router;
