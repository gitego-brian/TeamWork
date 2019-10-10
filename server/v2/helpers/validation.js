import schema from './joiValidation';
import pool from '../database/dbConnect';

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

	validateLogin(req, res, next) {
		const { email, password } = req.body;
		const { error } = schema.loginSchema.validate({
			email,
			password
		});
		if (error && error.details[0].type === 'any.required') {
			res.status(400).send({
				status: 400,
				error: error.details[0].message.replace(/[/"]/g, '')
			});
		} else next();
	}

	async validateArticle(req, res, next) {
		const { title, article } = req.body;
		const { error } = schema.articleSchema.validate({
			title,
			article
		});
		try {
			if (error) throw error.details[0].message.replace(/[/"]/g, '');
		} catch (err) {
			res.status(400).send({
				status: 400,
				error: err
			});
			return;
		}
		const query = 'SELECT * FROM articles WHERE title = $1';
		const values = [title];
		try {
			const result = await pool.query(query, values);
			if (result.rows[0]) {
				res.status(409).send({
					status: 409,
					error: 'Article already exists'
				});
			} else next();
		} catch (err) {
			res.status(500).send({
				status: 500,
				error: 'Internal server error'
			});
		}
	}
}

export default new Validate();
