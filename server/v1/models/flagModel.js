import uuidv1 from 'uuid/v1';
import Moment from 'moment';

class Flag {
	constructor(_reason, _flaggedBy, _authorId) {
		this.id = `flag-${uuidv1().split('-')[0]}`;
		this.reason = _reason;
		this.flaggedBy = _flaggedBy;
		this.authorId = _authorId;
		this.flaggedOn = Moment().format('YYYY-MMM-DD');
	}
}

export default Flag;
