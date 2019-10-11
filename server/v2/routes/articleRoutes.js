import { Router } from 'express';
import Helper from '../helpers/helper';
import ArticleController from '../controllers/articleController';
import Validation from '../helpers/validation';

const router = Router();

router.get('/', Helper.verifyToken, ArticleController.getArticles);
router.post('/', Helper.verifyToken, Validation.validateArticle, ArticleController.newArticle);
router.get('/:articleID', Helper.verifyToken, ArticleController.getSingleArticle);
router.patch('/:articleID', Helper.verifyToken, Validation.validateUpdate, ArticleController.updateArticle);
router.delete('/:articleID', Helper.verifyToken, ArticleController.deleteArticle);
router.post('/:articleID/flags', Helper.verifyToken, Validation.validateArticleFlag, ArticleController.flagArticle);
router.post('/:articleID/comments', Helper.verifyToken, Validation.validateComment, ArticleController.postComment);
router.post('/:articleID/comments/:commentID/', Helper.verifyToken, Validation.validateCommentFlag, ArticleController.flagComment);
router.delete('/:articleID/comments/:commentID/', Helper.verifyToken, ArticleController.deleteComment);


export default router;
