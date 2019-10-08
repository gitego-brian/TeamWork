import { Router } from 'express';
import UserController from '../controllers/userController';
import Validation from '../helpers/validation';

const router = Router();

router.post('/signup', Validation.validateSignup, UserController.signUp);

export default router;
