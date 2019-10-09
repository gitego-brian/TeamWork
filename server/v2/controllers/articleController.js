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
}

export default new ArticleController();
