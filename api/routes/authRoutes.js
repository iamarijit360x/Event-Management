const express = require('express');
const { signin, signup } = require('../controllers/auth');
const { validateSignin, validateSignup } = require('../validators/loginValidator');
const validateRequest = require('../middlewares/validatorMiddleware');

const router = express.Router();

router.post('/signin', validateSignin, validateRequest, signin);
router.post('/signup', validateSignup, validateRequest, signup);

module.exports = router;
