import { Router } from 'express';
import Helper from '../helpers/helper';
import ArticleController from '../controllers/articleController';

const router = Router();

router.get('/', Helper.verifyToken, ArticleController.getArticles);

export default router;
