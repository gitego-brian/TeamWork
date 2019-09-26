import Moment from 'moment';
// import Article from '../models/articleModel';
// import Comment from '../models/commentModel';
// import Flag from '../models/flagModel';
import Helper from '../helpers/helper';
import { articles } from '../data/data';
// import schema from '../helpers/joiValidation';

class ArticleController {
	getArticles(_req, res) {
		const sortedArticles = articles.sort(
			(a, b) => new Moment(b.createdOn).format('YYYYMMDD')
        - new Moment(a.createdOn).format('YYYYMMDD')
		);
		res.status(200).send({
			status: 200,
			message: 'Success',
			data: {
				articles: sortedArticles
			}
		});
	}

	shareArticle(req, res) {
		const article = Helper.findOne(req.params.articleID, articles);
		const { firstName, lastName } = req.payload;
		if (article) {
			article.sharedBy = `${firstName} ${lastName}`;
			res.status(201).send({
				status: 201,
				message: 'Article successfully shared',
				data: {
					article
				}
			});
		} else {
			res.status(404).send({
				status: 404,
				error: 'Article not found'
			});
		}
	}
}

export default new ArticleController();
