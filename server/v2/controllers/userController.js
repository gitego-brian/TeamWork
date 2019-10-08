import pool from '../database/dbConnect';
import Helper from '../helpers/helper';

class UserController {
    async signUp(req, res) {
        const {
            firstName, lastName, email, password, gender, jobRole, department, address
        } = req.body;

        const hash = Helper.hashPassword(password);
        const q = 'INSERT INTO users (firstname, lastname, email, password, gender, jobrole, department, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
        const values = [firstName, lastName, email, hash, gender, jobRole, department, address];
        try {
            const result = await pool.query(q, values);
            res.status(201).send({
                status: 201,
                message: 'User Account successfully created',
                data: {
                    token: Helper.getToken(result),
                }
            });
        } catch (err) {
            if (err.code === '23505') {
                res.status(409).send({
                    status: 409,
                    error: 'Email already exists'
                });
            } else {
                console.log(err);
                res.status(500).send({
                    status: 500,
                    error: 'Oops,server down'
                });
            }
        }
    }
}

export default new UserController();
