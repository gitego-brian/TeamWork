import Moment from 'moment';
import Article from '../models/articleModel';
import Comment from '../models/commentModel';
import Flag from '../models/flagModel';
import Helper from '../helpers/helper';
import { articles } from '../data/data';
import schema from '../helpers/joiValidation';

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
}

export default new ArticleController();
