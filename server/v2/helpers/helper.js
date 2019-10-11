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
		id, email, firstname: firstName, lastname: lastName, isadmin: isAdmin
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

	async flagger({ id }, elt, reason) {
		if (id === elt.authorid) {
			return { status: 400, error: 'You cannot flag your own' };
		}
		const match = await this.findFlags();
		const query = ' INSERT INTO commentFlags ($1, $2, $3)';
		elt.flags.push(flag);

		return { status: 201, message: 'flagged!', flag };
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
			try {
				const match = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
				if (!match.rows[0]) {
					res.status(401).send({
						status: 401,
						error: 'Invalid token'
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

	async findComments(res, id) {
		const query = `
			SELECT * FROM comments
			WHERE articleid = $1;`;
		const values = [id];
		try {
			const result = await pool.query(query, values);
			return result.rows;
		} catch (err) {
			return res.status(500).send({
				status: 500,
				error: 'Internal server error'
			});
		}
	}

	async findOne(what, where) {
		const query = `
        SELECT * FROM ${where}
        WHERE id = $1;`;
		const values = [what];
		try {
			const result = await pool.query(query, values);
			if (result.rows[0]) {
				return result.rows[0];
			}
			return 0;
		} catch (err) {
			return err.message;
		}
	}

	async findCommentFlags(id) {
		const query = `
			SELECT * FROM commentflags
			WHERE commentid = $1;`;
		const values = [id];
		try {
			const result = await pool.query(query, values);
			return result;
		} catch (err) { return err.message; }
	}

	async findArticleFlags(id) {
		const query = `
			SELECT * FROM articleflags
			WHERE articleid = $1;`;
		const values = [id];
		try {
			const result = await pool.query(query, values);
			return result.rows;
		} catch (err) { return err.message; }
	}
}

export default new Helper();
