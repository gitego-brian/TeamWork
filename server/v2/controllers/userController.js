import pool from '../database/dbConnect';
import Helper from '../helpers/helper';

class UserController {
  async signUp(req, res) {
    const {
      firstName, lastName, email, password, gender, jobRole, department, address
    } = req.body;

    const hash = Helper.hashPassword(password);
    const query = 'INSERT INTO users (firstname, lastname, email, password, gender, jobrole, department, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const values = [firstName, lastName, email, hash, gender, jobRole, department, address];
    try {
      const result = await pool.query(query, values);
      res.status(201).send({
        status: 201,
        message: 'User Account successfully created',
        data: {
          token: Helper.getToken(result.rows[0]),
        }
      });
    } catch (err) {
      if (err.code === '23505') {
        res.status(409).send({
          status: 409,
          error: 'Email already exists'
        });
      } else {
        res.status(500).send({
          status: 500,
          error: err.message
        });
      }
    }
  }

  async signIn(req, res) {
    const q = `
        SELECT * FROM users WHERE email = $1;
        `;
    let match;
    try { match = await pool.query(q, [req.body.email]); } catch (err) { res.status(500).send({ status: 500, error: 'Internal server error' }); }
    if (match.rows[0]) {
      const checked = Helper.checkPassword(match.rows[0].password, req.body.password);
      if (checked) {
        if (match.rows[0].isadmin === true) {
          res.status(200).send({
            status: 200,
            message: 'Admin is successfully logged in',
            data: {
              token: Helper.getToken(match.rows[0])
            }
          });
        } else {
          res.status(200).send({
            status: 200,
            message: 'User is successfully logged in',
            data: {
              token: Helper.getToken(match.rows[0])
            }
          });
        }
      } else {
        res.status(401).send({
          status: 401,
          error: 'Password incorrect'
        });
      }
    } else {
      res.status(404).send({
        status: 404,
        error: 'User not found'
      });
    }
  }

  async makeAdmin(req, res) {
    const user = await Helper.findOne(req.body.email, 'users');
    if (user) {
      const query = `
			UPDATE users SET isadmin = $1 WHERE email = $2 RETURNING *;
			`;
      const values = [req.body.isAdmin, req.body.email];
      try {
        const result = await pool.query(query, values);
        res.status(201).send({
          status: 201,
          message: 'Admin toggled',
          data: {
            isAdmin: result.rows[0].isadmin,
          }
        });
      } catch (err) {
        res.status(500).send({
          status: 500,
          error: err.message
        });
      }
    } else {
      res.status(404).send({
        status: 404,
        error: 'User not found'
      });
    }
  }
}

export default new UserController();
