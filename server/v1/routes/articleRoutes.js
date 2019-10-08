import { Router } from 'express';

import Helper from '../helpers/helper';

import ArticleController from '../controllers/articleController';

const router = Router();

router.get('/', Helper.verifyToken, ArticleController.getArticles);

router.get('/flagged', Helper.verifyToken, ArticleController.getFlaggedArticles);

router.post('/', Helper.verifyToken, ArticleController.newArticle);

router.get('/:articleID', Helper.verifyToken, ArticleController.getSingleArticle);

router.post('/:articleID', Helper.verifyToken, ArticleController.shareArticle);

router.patch('/:articleID', Helper.verifyToken, ArticleController.updateArticle);

router.delete('/:articleID', Helper.verifyToken, ArticleController.deleteArticle);

router.post('/:articleID/flags', Helper.verifyToken, ArticleController.flagArticle);

router.post('/:articleID/comments', Helper.verifyToken, ArticleController.postComment);

router.post('/:articleID/comments/:commentID/', Helper.verifyToken, ArticleController.flagComment);

router.delete('/:articleID/comments/:commentID/', Helper.verifyToken, ArticleController.deleteComment);

export default router;
