import { Router } from 'express';
import UserController from '../controllers/userController';
import Helper from '../helpers/helper';

const router = Router();

router.post('/signup', UserController.signUp);

router.post('/signin', UserController.signIn);

router.post('/users/makeadmin', UserController.makeAdmin);

router.delete('/users/delete', Helper.verifyToken, UserController.deleteUser);

export default router;
