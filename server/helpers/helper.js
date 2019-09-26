import jwt from 'jsonwebtoken';
import { users } from '../data/data';

class Helper {
	getToken({
 id, email, firstName, lastName, isAdmin 
}) {
		const token = jwt.sign(
			{
				id,
				email,
				firstName,
				lastName,
				isAdmin
			},
			process.env.JWT_KEY
		);
		return token;
	}

	verifyToken(req, res, next) {
		if (!req.headers.authorization) {
			res.status(401).send({
				status: 401,
				error: 'Please log in or sign up first'
			});
		} else {
			const token = req.headers.authorization.split(' ')[1];
			try {
				const decoded = jwt.verify(token, process.env.JWT_KEY);
				req.payload = decoded;
			} catch (error) {
				return res.status(401).send({
					status: 401,
					error: 'Authentication failed'
				});
			}
			const { email } = req.payload;
			const match = users.find((el) => el.email === email);
			if (!match) {
				res.status(401).send({
					status: 401,
					error: 'Invalid token'
				});
			} else {
				next();
			}
		}
	}

	findOne(id, where) {
		return where.find((el) => `${el.id}` === id);
	}
}

export default new Helper();
