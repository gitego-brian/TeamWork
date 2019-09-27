const uuidv1 = require('uuid/v1');
const Moment = require('moment');

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
