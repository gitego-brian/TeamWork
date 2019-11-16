import Moment from 'moment';
import Article from '../models/articleModel';
import Comment from '../models/commentModel';
import Helper from '../helpers/helper';
import { articles } from '../data/data';
import schema from '../helpers/joiValidation';

class ArticleController {
  getArticles(_req, res) {
    Helper.sendSuccess(res, 200, 'All articles', { articles: Helper.sortArticles(articles) });
  }

  getFlaggedArticles(req, res) {
    if (req.payload.isAdmin) {
      const flaggedArticles = [];
      articles.forEach((el) => {
        if (el.flags.length) {
          flaggedArticles.push(el);
        }
      });
      if (!flaggedArticles.length) {
        Helper.sendSuccess(res, 404, 'No flagged articles');

      } else Helper.sendSuccess(res, 200, 'Flagged articles', { flaggedArticles: Helper.sortArticles(flaggedArticles) });
    } else {
      Helper.sendError(res, 403, 'Not Authorized');

    }
  }

  newArticle(req, res) {
    const { title, article } = req.body;
    const { error } = schema.articleSchema.validate({
      title,
      article
    });
    try {
      if (error) throw error.details[0].message.replace(/[/"]/g, '');
    } catch (err) {
      Helper.sendError(res, 400, err);
      return;
    }
    const match = articles.find((el) => el.title === req.body.title);
    if (match) {
      Helper.sendError(res, 409, 'Article already exists');
    } else {
      const { firstName, lastName, id: authorId } = req.payload;
      const authorName = `${firstName} ${lastName}`;
      const newArticle = new Article(
        req.body.title,
        req.body.article,
        authorId,
        authorName
      );
      const { title, article, id } = newArticle;
      articles.push(newArticle);
      Helper.sendSuccess(res, 201, 'Article successfully created', { title, authorName, article, id, authorId })
    }
  }

  getSingleArticle(req, res) {
    const article = Helper.findOne(req.params.articleID, articles);
    if (article) {
      Helper.sendSuccess(res, 200, 'Success', { article })
    } else {
      Helper.sendError(res, 404, 'Article not found', { article })

    }
  }

  updateArticle(req, res) {
    const { title, article } = req.body;
    const authorId = req.payload.id;
    const articleToUpdate = Helper.findOne(req.params.articleID, articles);
    if (articleToUpdate) {
      if (articleToUpdate.authorId === authorId) {
        try {
          if (!title && !article) throw "Can't update if no changes made";
        } catch (err) {
          Helper.sendError(res, 400, err);
          return;
        }

        if (title) {
          articleToUpdate.title = title;
        }
        if (article) {
          articleToUpdate.article = article;
        }
        articleToUpdate.flags = [];
        const updatedArticle = articleToUpdate;
        updatedArticle.updatedOn = Moment().format('YYYY-MMM-DD');
        Helper.sendSuccess(res, 200, 'Article successfully edited', { updateArticle });
      } else {
        Helper.sendError(res, 403, 'Not Authorized');
      }
    } else {
      Helper.sendError(res, 404, 'Article not found');
    }
  }

  shareArticle(req, res) {
    const article = Helper.findOne(req.params.articleID, articles);
    const { firstName, lastName } = req.payload;
    if (article) {
      article.sharedBy = `${firstName} ${lastName}`;
      Helper.sendSuccess(res, 201, 'Article successfully shared', { article });
    } else {
      Helper.sendError(res, 404, 'Article not found');
    }
  }

  flagArticle(req, res) {
    const { reason } = req.body;
    const { error } = schema.flagSchema.validate({
      reason
    });
    const err = Helper.validateFlag(reason, error, 'article');
    if (err) {
      Helper.sendError(res, 400, err);
    } else {
      const { articleID } = req.params;
      const article = Helper.findOne(articleID, articles);
      if (article) {
        const respond = Helper.flagger(req.payload, article, reason);
        const {
          error, status, message, flag
        } = respond;
        if (error) {
          Helper.sendError(res, status, `${error} article`);
        } else {
          Helper.sendSuccess(res, status, `Article ${message}`, { flag, article });
        }
      } else {
        Helper.sendError(res, 404, `Article not found`);
      }
    }
  }

  deleteArticle(req, res) {
    const { articleID } = req.params;
    const article = Helper.findOne(articleID, articles);
    if (article) {
      const response = Helper.deleteSth(
        req.payload,
        articles,
        article,
        'article'
      );
      if (response.status === 200) {
        Helper.sendSuccess(res, response.status, `Article ${response.message}`);
      } else {
        Helper.sendError(res, response.status, response.message);
      }
    } else {
      Helper.sendError(res, 404, 'Article not found');
    }
  }

  postComment(req, res) {
    const { comment } = req.body;
    const { error } = schema.commentSchema.validate({
      comment
    });
    try {
      if (error) {
        if (error.details[0].type === 'any.required') {
          throw "You didn't write anything";
        } else throw error.details[0].message.replace(/[/"]/g, '');
      }
    } catch (err) {
      Helper.sendError(res, 400, err);
      return;
    }
    const authorId = req.payload.id;
    const article = Helper.findOne(req.params.articleID, articles);
    if (article) {
      const match = article.comments.find(
        (el) => el.comment === req.body.comment
      );
      if (match) {
        Helper.sendError(res, 409, 'Comment already exists');
      } else {
        const newComment = new Comment(req.body.comment, authorId);
        article.comments.push(newComment);
        Helper.sendSuccess(res, 201, 'Comment posted successfully', {
          articleTitle: article.title,
          article: article.article,
          comment: newComment
        });
      }
    } else {
      Helper.sendError(res, 404, 'Article not found');
    }
  }

  flagComment(req, res) {
    const { reason } = req.body;
    const { error } = schema.flagSchema.validate({
      reason
    });
    const err = Helper.validateFlag(reason, error, 'comment');
    if (err) {
      Helper.sendError(res, 400, err);
    } else {
      const { commentID } = req.params;
      const article = Helper.findOne(req.params.articleID, articles);
      if (article) {
        const comment = Helper.findOne(commentID, article.comments);
        if (comment) {
          const response = Helper.flagger(req.payload, comment, reason);
          const {
            error, status, message, flag
          } = response;
          if (error) {
            Helper.sendError(res, status, `${error} comment`);
          } else {
            Helper.sendSuccess(res, status, `Comment ${message}`, { flag, comment });
          }
        } else {
          Helper.sendError(res, 404, 'Comment not found');
        }
      } else {
        Helper.sendError(res, 404, 'Article not found');
      }
    }
  }

  deleteComment(req, res) {
    const { commentID, articleID } = req.params;
    const article = Helper.findOne(articleID, articles);
    if (article) {
      const comment = Helper.findOne(commentID, article.comments);
      if (comment) {
        const response = Helper.deleteSth(
          req.payload,
          articles,
          article,
          'comment'
        );

        if (response.status === 200) {
          Helper.sendSuccess(res, response.status, `Comment ${response.message}`);
        } else {
          Helper.sendError(res, response.status, response.message);
        }
      } else {
        Helper.sendError(res, 404, 'Comment not found');
      }
    } else {
      Helper.sendError(res, 404, 'Article not found');
    }
  }
}
export default new ArticleController();
