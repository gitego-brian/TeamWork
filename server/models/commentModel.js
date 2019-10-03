import uuidv1 from 'uuid/v1';
import Moment from 'moment';

class Comment {
	constructor(_comment, _authorId) {
		this.comment = _comment;
		this.id = `comment-${uuidv1().split('-')[0]}`;
		this.authorId = _authorId;
		this.postedOn = Moment().format('YYYY-MMM-DD');
		this.flags = [];
	}
}

export default Comment;
