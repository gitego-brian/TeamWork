import { Router } from 'express';
import UserController from '../controllers/userController';
import Validation from '../helpers/validation';
import Helper from '../helpers/helper';

const router = Router();

router.post('/signup', Validation.validateSignup, UserController.signUp);
router.post('/signin', Validation.validateLogin, UserController.signIn);
router.patch('/users/makeadmin', Helper.verifyToken, UserController.makeAdmin);

export default router;
