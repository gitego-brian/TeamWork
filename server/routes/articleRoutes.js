import { Router } from 'express';

import Helper from '../helpers/helper';

import ArticleController from '../controllers/articleController';

const router = Router();

router.get('/', Helper.verifyToken, ArticleController.getArticles);

router.post('/:articleID', Helper.verifyToken, ArticleController.shareArticle);

export default router;
