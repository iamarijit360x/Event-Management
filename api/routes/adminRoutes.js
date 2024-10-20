const express = require('express');
const validateRequest = require('../middlewares/validatorMiddleware');
const serviceValidator = require('../validators/serviceValidator');
const { createService, getAllBooking,signup, editService, deleteService } = require('../controllers/admin');
const { verifyAdmin, verifyUser } = require('../middlewares/authMiddleware');
const { validateSignup } = require('../validators/loginValidator');
const { validateEditService } = require('../validators/serviceValidatorEdit');
const { validateDeleteService } = require('../validators/deleteServiceValidator');

const router = express.Router();
//Unprotected Route for admin
router.post('auth/signup', validateSignup, validateRequest, signup);
router.use(verifyUser);
router.use(verifyAdmin);
//protected Routes for admin
router.post('/service', serviceValidator, validateRequest, createService);
router.put('/service/:serviceId',validateEditService, validateRequest,editService);
router.delete('/service/:serviceId',validateDeleteService, validateRequest,deleteService);
router.get('/booking', getAllBooking);


module.exports = router;
