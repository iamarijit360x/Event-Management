const express = require('express');
const validateRequest = require('../middlewares/validatorMiddleware');
const serviceValidator = require('../validators/serviceValidator');
const { createService, getAllBooking,signup } = require('../controllers/admin');
const { verifyAdmin, verifyUser } = require('../middlewares/authMiddleware');
const { validateSignup } = require('../validators/loginValidator');

const router = express.Router();
//Unprotected Route for admin
router.post('/signup', validateSignup, validateRequest, signup);
router.use(verifyUser);
router.use(verifyAdmin);
//protected Routes for admin
router.get('/booking', getAllBooking);
router.post('/service', serviceValidator, validateRequest, createService);

module.exports = router;
