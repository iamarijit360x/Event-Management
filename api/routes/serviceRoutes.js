const express = require('express');
const serviceValidator = require('../validators/serviceValidator');
const { filterServices,createService} = require('../controllers/service');
const { verifyUser, verifyAdmin } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validatorMiddleware');
const {  } = require('../controllers/admin');

const router = express.Router();

router.use(verifyUser);
router.get('/', filterServices);


module.exports = router;
