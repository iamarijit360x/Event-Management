import express from 'express';
import { signin, signup } from '../controllers/auth.mjs';
import { validateSignin, validateSignup } from '../validators/loginValidator.mjs';
import validateRequest from '../middlewares/validatorMiddleware.mjs';
const router = express.Router();

router.post('/signin',validateSignin,validateRequest,signin);
router.post('/signup',validateSignup,validateRequest,signup);

export default router;
