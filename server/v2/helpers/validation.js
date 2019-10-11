import schema from './joiValidation';
import pool from '../database/dbConnect';
import Helper from './helper';

class Validate {
  async validateSignup(req, res, next) {
    const {
      firstName, lastName, email, password, gender, jobRole, department, address,
    } = req.body;
    const { error } = schema.signupSchema.validate({
      firstName, lastName, email, password, gender, jobRole, department, address,
    });
    if (error) {
      if (error.details[0].type === 'string.pattern.base') {
        if (error.details[0].message.replace(/[/"]/g, '').split(' ')[0] === 'password') {
          res.status(400).send({
            status: 400,
            error:
              'password must not be less than 8 characters and must contain lowercase letters, uppercase letters, numbers and special characters',
          });
        } else {
          res.status(400).send({
            status: 400,
            error: `${error.details[0].message.split('with')[0].replace(/[/"]/g, '')}is not valid`,
          });
        }
      } else if (error.details[0].type === 'any.only') {
        res.status(400).send({
          status: 400,
          error: 'gender can be Male(M) or Female(F)',
        });
      } else {
        res.status(400).send({
          status: 400,
          error: error.details[0].message.replace(/[/"]/g, ''),
        });
      }
    } else next();
  }

  validateLogin(req, res, next) {
    const { email, password } = req.body;
    const { error } = schema.loginSchema.validate({
      email,
      password,
    });
    if (error && error.details[0].type === 'any.required') {
      res.status(400).send({
        status: 400,
        error: error.details[0].message.replace(/[/"]/g, ''),
      });
    } else next();
  }

  async validateArticle(req, res, next) {
    const { title, article } = req.body;
    const { error } = schema.articleSchema.validate({
      title,
      article,
    });
    try {
      if (error) throw error.details[0].message.replace(/[/"]/g, '');
    } catch (err) {
      res.status(400).send({
        status: 400,
        error: err,
      });
      return;
    }
    const query = 'SELECT * FROM articles WHERE title = $1';
    const values = [title];
    try {
      const result = await pool.query(query, values);
      next();
    } catch (err) {
      res.status(500).send({
        status: 500,
        error: 'Internal server error',
      });
    }
  }

  async validateUpdate(req, res, next) {
    const { title, article } = req.body;
    const { id: authorId } = req.payload;
    const { error } = schema.articleSchema.validate({
      title,
      article,
    });
    try {
      if (error && error.details[0].type === 'string.pattern.base') throw error.details[0].message.replace(/[/"]/g, '');
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err,
      });
    }
    const articleToUpdate = await Helper.findOne(req.params.articleID, 'articles');
    if (articleToUpdate) {
      if (articleToUpdate.authorid === authorId) {
        try {
          if (!title && !article) throw 'Can\'t update if no changes made';
          else next();
        } catch (err) {
          return res.status(400).send({
            status: 400,
            error: err,
          });
        }
      } else {
        return res.status(403).send({
          status: 403,
          error: 'Not Authorized',
        });
      }
    } else {
      return res.status(404).send({
        status: 404,
        error: 'Article not found',
      });
    }
  }

  validateCommentFlag(req, res, next) {
    const { reason } = req.body;
    const { error } = schema.flagSchema.validate({
      reason,
    });
    try {
      if (!reason) throw 'Can\'t flag comment, no reason provided';
      if (error) {
        if (error.details[0].type === 'string.min') {
          throw 'That reason may not be understandable, Care to elaborate?';
        }
        if (error.details[0].type === 'any.required') {
          throw 'Can\'t flag comment, no reason provided';
        }
      } next();
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err,
      });
    }
  }

  validateArticleFlag(req, res, next) {
    const { reason } = req.body;
    const { error } = schema.flagSchema.validate({
      reason,
    });
    try {
      if (!reason) throw 'Can\'t flag article, no reason provided';
      if (error) {
        if (error.details[0].type === 'string.min') {
          throw 'That reason may not be understandable, Care to elaborate?';
        }
        if (error.details[0].type === 'any.required') {
          throw 'Can\'t flag article, no reason provided';
        }
      } next();
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err,
      });
    }
  }

  async validateComment(req, res, next) {
    const { comment } = req.body;
    const { error } = schema.commentSchema.validate({
      comment,
    });
    try {
      if (error) {
        if (error.details[0].type === 'any.required') {
          throw "You didn't write anything";
        } else throw error.details[0].message.replace(/[/"]/g, '');
      } else next();
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err,
      });
    }
  }

  validateParams(req, res, next) {
    const validArticleID = Number.isInteger(Number(req.params.articleID));
    const validCommentID = Number.isInteger(Number(req.params.commentID));
    if (req.params.articleID && (!validArticleID
      || (parseInt(req.params.articleID, 10) > 1000000000))) {
      return res.status(400).send({
        status: 400,
        error: 'Invalid parameters',
      });
    }
    if (req.params.commentID && (!validCommentID
      || (parseInt(req.params.commentID, 10) > 1000000000))) {
      return res.status(400).send({
        status: 400,
        error: 'Invalid parameters',
      });
    } next();
  }
}

export default new Validate();
