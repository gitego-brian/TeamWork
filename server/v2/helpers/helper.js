/* eslint-disable no-throw-literal */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../database/dbConnect';


class Helper {
	hashPassword(password) {
		const salt = bcrypt.genSaltSync(10);
		return bcrypt.hashSync(password, salt);
	}

	checkPassword(hashed, password) {
		return bcrypt.compareSync(password, hashed);
	}

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

	async verifyToken(req, res, next) {
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
			const match = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
			if (!match.rows[0]) {
				res.status(401).send({
					status: 401,
					error: 'Invalid token'
				});
			} else {
				next();
			}
		}
	}
}

export default new Helper();
