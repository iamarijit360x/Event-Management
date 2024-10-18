const express = require('express');
const validateRequest = require('../middlewares/validatorMiddleware');
const serviceValidator = require('../validators/serviceValidator');
const { createService } = require('../controllers/admin');
const { verifyAdmin, verifyUser } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyUser);
router.use(verifyAdmin);
router.post('/create-service', serviceValidator, validateRequest, createService);

module.exports = router;
