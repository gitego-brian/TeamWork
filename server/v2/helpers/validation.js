import schema from './joiValidation';

class Validate {
	async validateSignup(req, res, next) {
		const {
			firstName, lastName, email, password, gender, jobRole, department, address
		} = req.body;
		const { error } = schema.signupSchema.validate({
			firstName, lastName, email, password, gender, jobRole, department, address
		});
		if (error) {
			if (error.details[0].type === 'string.pattern.base') {
				if (error.details[0].message.replace(/[/"]/g, '').split(' ')[0] === 'password') {
					res.status(400).send({
						status: 400,
						error:
                            'password must not be less than 8 characters and must contain lowercase letters, uppercase letters, numbers and special characters'
					});
				} else {
					res.status(400).send({
						status: 400,
						error: `${error.details[0].message.split('with')[0].replace(/[/"]/g, '')}is not valid`
					});
				}
			} else if (error.details[0].type === 'any.only') {
				res.status(400).send({
					status: 400,
					error: 'gender can be Male(M) or Female(F)'
				});
			} else {
				res.status(400).send({
					status: 400,
					error: error.details[0].message.replace(/[/"]/g, '')
				});
			}
		} else next();
	}
}

export default new Validate();
