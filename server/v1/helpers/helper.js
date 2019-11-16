import jwt from 'jsonwebtoken';
import Moment from 'moment';
import { users } from '../data/data';
import Flag from '../models/flagModel';

class Helper {
  sendSuccess(res, status, message, data) {
    res.status(status).send({
      status,
      message,
      data,
    });
  }

  sendError(res, status, error) {
    res.status(status).send({
      status,
      error,
    });
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

  flagger({ firstName, lastName, id }, elt, reason) {
    if (id === elt.authorId) {
      return { status: 400, error: 'You cannot flag your own' };
    }
    const match = elt.flags.find((el) => el.authorId === id);
    if (match) {
      return { status: 400, error: 'You cannot flag your own' };
    }
    const flag = new Flag(reason, `${firstName} ${lastName}`, id);
    elt.flags.push(flag);

    return { status: 201, message: 'flagged!', flag };
  }

  validateFlag(reason, error, type) {
    try {
      if (!reason) throw `Can't flag ${type}, no reason provided`;
      if (error) {
        if (error.details[0].type === 'string.min') {
          throw 'That reason may not be understandable, Care to elaborate?';
        }
        if (error.details[0].type === 'any.required') {
          throw `Can't flag ${type}, no reason provided`;
        }
      }
    } catch (err) {
      return err;
    }
  }

  sortArticles(array) {
    return array.sort(
      (a, b) => new Moment(b.createdOn).format('YYYYMMDD')
        - new Moment(a.createdOn).format('YYYYMMDD')
    );
  }

  deleteSth({ id, isAdmin }, array, elt, keyword) {
    if ((elt.flags.length && isAdmin) || id === elt.authorId) {
      array.splice(array.indexOf(elt), 1);
      return { status: 200, message: 'successfully deleted' };
    }
    try {
      if (!elt.flags.length && isAdmin) throw `Cannot delete an unflagged ${keyword}`;
      else throw 'Not Authorized';
    } catch (err) {
      return { status: 403, message: err };
    }
  }
}

export default new Helper();
