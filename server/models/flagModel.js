const uuidv1 = require('uuid/v1');
const Moment = require('moment');

class Flag {
	constructor(_reason, _flaggedBy) {
		this.id = `flag-${uuidv1().split('-')[0]}`;
		this.reason = _reason;
		this.flaggedBy = _flaggedBy;
		this.flaggedOn = Moment().format('YYYY-MMM-DD');
	}
}

export default Flag;
