/* eslint-disable no-throw-literal */
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
		const { title, article } = req.body;
		const { firstName, lastName, id: authorId } = req.payload;
		const authorName = `${firstName} ${lastName}`;
		const query = `
        INSERT INTO articles (authorid, authorname, title, article)
        VALUES ($1,$2, $3, $4) RETURNING *;
        `;
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
				const comments = await Helper.findComments(req.params.articleID);
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
			return res.status(200).send({
				status: 200,
				message: 'Article successfully edited',
				data: {
					Article: result.rows[0]
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
		const { id, isAdmin } = req.payload.id;
		if (article) {
			const flags = await Helper.findFlags(articleID, 'article', res);
			if (flags || id === article.authorId) {
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
				try {
					if ((flags.length < 1) && isAdmin) throw 'Cannot delete an unflagged commment';
					else throw 'Not Authorized';
				} catch (err) {
					return res.status(403).send({ status: 403, error: err.message });
				}
			}
		} else return res.status(404).send({ status: 404, error: 'Article not found' });
	}
}

export default new ArticleController();
