import uuidv1 from 'uuid/v1';
import Moment from 'moment';

class Article {
	constructor(_articleTitle, _article, _authorId, _authorName) {
		this.id = `article-${uuidv1().split('-')[0]}`;
		this.authorId = _authorId;
		this.authorName = _authorName;
		this.title = _articleTitle;
		this.article = _article;
		this.createdOn = Moment().format('YYYY-MMM-DD');
		this.comments = [];
		this.flags = [];
	}
}

export default Article;
