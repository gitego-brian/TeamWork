import { Router } from 'express';
import UserController from '../controllers/userController';
import Helper from '../helpers/helper';

const router = Router();

router.post('/signup', UserController.signUp);

router.post('/signin', UserController.signIn);

router.post('/users', UserController.makeAdmin);

router.delete('/users', Helper.verifyToken, UserController.deleteUser);

export default router;
