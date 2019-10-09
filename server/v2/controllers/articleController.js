/* eslint-disable no-throw-literal */
import pool from '../database/dbConnect';

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
				error: 'Internal server error'
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
			console.log(err);

			res.status(500).send({ status: 500, error: 'Internal server error' });
		}
	}
}

export default new ArticleController();
