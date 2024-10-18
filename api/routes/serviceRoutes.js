const express = require('express');
const serviceValidator = require('../validators/serviceValidator');
const { filterServices, getAllServices } = require('../controllers/service');
const { verifyUser, verifyAdmin } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validatorMiddleware');
const { createService } = require('../controllers/admin');

const router = express.Router();

router.use(verifyUser);
// router.get('/', serviceValidator, getAllServices);
router.get('/', filterServices);
router.use(verifyAdmin);
router.post('/', serviceValidator, validateRequest, createService);

module.exports = router;
