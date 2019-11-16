import pool from '../database/dbConnect';
import Helper from '../helpers/helper';

class ArticleController {
  async getArticles(_req, res) {
    const query = `
    SELECT * FROM articles ORDER BY createdon DESC;
    `;
    try {
      const result = await pool.query(query);
      res.status(200).send({
        status: 200,
        message: 'All articles',
        data: {
          articles: result.rows
        }
      });
    } catch (err) {
      res.status(500).send({
        status: 500,
        error: err.message
      });
    }
  }

  async newArticle(req, res) {
    let { title, article } = req.body;
    const { firstName, lastName, id: authorId } = req.payload;
    const authorName = `${firstName} ${lastName}`;
    const query = `
        INSERT INTO articles (authorid, authorname, title, article)
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    title = title.replace(/\s+/g, ' ');
    article = article.replace(/\s+/g, ' ');
    const values = [authorId, authorName, title, article];
    try {
      const result = await pool.query(query, values);
      const {
        id, title, article, authorid: authorId, authorname: authorName
      } = result.rows[0];
      res.status(201).send({
        status: 201,
        message: 'Article successfully created',
        data: {
          id, title, article, authorId, authorName
        }
      });
    } catch (err) {
      res.status(500).send({ status: 500, error: err.message });
    }
  }

  async getSingleArticle(req, res) {
    const query = `
        SELECT * FROM articles
        WHERE id = $1`;
    const values = [req.params.articleID];
    try {
      const result = await pool.query(query, values);
      if (result.rows[0]) {
        const comments = await Helper.findComments(res, req.params.articleID);
        const {
          id, authorid: authorId, authorname: authorName, title, article, createdon: createdOn
        } = result.rows[0];
        return res.status(200).send({
          status: 200,
          message: 'Success',
          data: {
            Article: {
              id, authorId, authorName, title, article, createdOn
            },
            Comments: comments
          }
        });
      }
      return res.status(404).send({
        status: 404,
        error: 'Article not found'
      });
    } catch (err) {
      return res.status(500).send({
        status: 500,
        error: err.message
      });
    }
  }

  async updateArticle(req, res) {
    const { title, article } = req.body;
    const articleToUpdate = await Helper.findOne(req.params.articleID, 'articles');
    const newTitle = title || articleToUpdate.title;
    const newArticle = article || articleToUpdate.article;
    const query = `
                UPDATE articles SET title = $1, article = $2 WHERE id = $3 RETURNING *;
                `;
    const values = [newTitle, newArticle, req.params.articleID];
    try {
      const result = await pool.query(query, values);
      const {
        id, authorid: authorId, authorname: authorName, createdon: createdOn
      } = result.rows[0];
      return res.status(200).send({
        status: 200,
        message: 'Article successfully edited',
        data: {
          article: {
            id, authorId, authorName, title, article, createdOn
          }
        }
      });
    } catch (err) {
      return res.status(500).send({
        status: 500,
        error: err.message
      });
    }
  }

  async deleteArticle(req, res) {
    const { articleID } = req.params;
    const article = await Helper.findOne(articleID, 'articles');
    const flags = Helper.findArticleFlags(articleID);
    const { id, isAdmin } = req.payload;
    if (article) {
      if ((isAdmin && flags[0]) || id === article.authorid) {
        const query = `
DELETE FROM articles WHERE id = $1;
`;
        const values = [articleID];
        try {
          const result = await pool.query(query, values);
          return res.status(200).send({ status: 200, message: 'Article successfully deleted' });
        } catch (err) {
          res.status(500).send({ status: 500, error: err.message });
        }
      } else {
        return res.status(403).send({ status: 403, error: 'Not Authorized' });
      }
    } else return res.status(404).send({ status: 404, error: 'Article not found' });
  }

  async flagArticle(req, res) {
    const { reason } = req.body;
    const { articleID } = req.params;
    const { id } = req.payload;
    const article = await Helper.findOne(articleID, 'articles');
    if (article) {
      if (article.authorid === id) {
        return res.status(400).send({
          status: 400,
          error: 'You cannot flag your own article'
        });
      }
      const query = `INSERT INTO articleFlags (authorid, articleid, reason) 
VALUES ($1, $2, $3) RETURNING *;
`;
      const values = [id, articleID, reason];
      try {
        const result = await pool.query(query, values);
        const {
          id, authorid: authorId, articleid: articleId, reason, flaggedon: flaggedOn
        } = result.rows[0];
        return res.status(201).send({
          status: 201,
          message: 'Article flagged!',
          data: {
            flag: {
              id, authorId, articleId, reason, flaggedOn
            },
            article: {
              id: article.id,
              title: article.title,
              article: article.article,
              authorId: article.authorid,
              authorName: article.authorname

            }
          }
        });
      } catch (err) {
        return res.status(500).send({
          status: 500,
          error: err.message
        });
      }
    } else {
      return res.status(404).send({
        status: 404,
        error: 'Article not found'
      });
    }
  }

  async postComment(req, res) {
    const { comment } = req.body;
    const authorId = req.payload.id;
    const article = await Helper.findOne(req.params.articleID, 'articles');
    if (article) {
      const query = `
INSERT INTO comments (authorid, articleid, comment) VALUES ($1, $2, $3) RETURNING *;
`;
      const values = [authorId, req.params.articleID, comment];
      try {
        const result = await pool.query(query, values);
        const {
          id, authorid: authorId, articleid: articleId, comment, postedon: postedOn
        } = result.rows[0];
        return res.status(201).send({
          status: 201,
          message: 'Comment posted successfully',
          data: {
            articleTitle: article.title,
            article: article.article,
            comment: {
              id, authorId, articleId, comment, postedOn
            }
          }

        });
      } catch (err) {
        return res.status(500).send({
          status: 500,
          error: err.message
        });
      }
    } else {
      res.status(404).send({
        status: 404,
        error: 'Article not found'
      });
    }
  }


  async flagComment(req, res) {
    const { reason } = req.body;
    const { articleID, commentID } = req.params;
    const { id } = req.payload;
    const article = await Helper.findOne(articleID, 'articles');
    const comment = await Helper.findOne(commentID, 'comments');
    if (article) {
      if (comment) {
        if (comment.authorid === id) {
          return res.status(400).send({
            status: 400,
            error: 'You cannot flag your own comment'
          });
        }
        const query = `INSERT INTO commentflags (authorid, commentid, reason) 
VALUES ($1, $2, $3) RETURNING *;
`;
        const values = [id, commentID, reason];
        try {
          const result = await pool.query(query, values);
          const {
            id, authorid: authorId, commentid: commentId, reason, flaggedon: flaggedOn
          } = result.rows[0];
          return res.status(201).send({
            status: 201,
            message: 'Comment flagged!',
            data: {
              flag: {
                id, authorId, commentId, reason, flaggedOn
              },
              comment
            }
          });
        } catch (err) {
          return res.status(500).send({
            status: 500,
            error: err.message
          });
        }
      } else {
        return res.status(404).send({
          status: 404,
          error: 'Comment not found'
        });
      }
    } else {
      return res.status(404).send({
        status: 404,
        error: 'Article not found'
      });
    }
  }

  async deleteComment(req, res) {
    const { articleID, commentID } = req.params;
    const { id, isAdmin } = req.payload;
    const article = await Helper.findOne(articleID, 'articles');
    const comment = await Helper.findOne(commentID, 'comments');
    const flagQuery = `
SELECT * FROM articleflags WHERE articleid = $1;`;
    const flagValues = [articleID];
    const flagResult = await pool.query(flagQuery, flagValues);
    if (article) {
      if (comment) {
        if ((isAdmin && flagResult.rows[0]) || id === comment.authorid) {
          const query = `
DELETE FROM comments WHERE id = $1;
`;
          const values = [commentID];
          try {
            const result = await pool.query(query, values);
            return res.status(200).send({ status: 200, message: 'Comment successfully deleted' });
          } catch (err) {
            res.status(500).send({ status: 500, error: err.message });
          }
        } else {
          return res.status(403).send({ status: 403, error: 'Not Authorized' });
        }
      } else return res.status(404).send({ status: 404, error: 'Comment not found' });
    } else return res.status(404).send({ status: 404, error: 'Article not found' });
  }
}

export default new ArticleController();
