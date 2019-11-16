import bcrypt from 'bcrypt';
import Helper from '../helpers/helper';
import schema from '../helpers/joiValidation';
import User from '../models/userModel';
import { users } from '../data/data';

class UserController {
  signUp(req, res) {
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      jobRole,
      department,
      address
    } = req.body;
    const { error } = schema.signupSchema.validate({
      firstName,
      lastName,
      email,
      password,
      gender,
      jobRole,
      department,
      address
    });
    try {
      if (error) {
        if (error.details[0].type === 'string.pattern.base') {
          if (error.details[0].message.replace(/[/"]/g, '').split(' ')[0] === 'password') throw 'password must not be less than 8 characters and must contain lowercase letters, uppercase letters, numbers and special characters';
          else throw `${error.details[0].message.split('with')[0].replace(/[/"]/g, '')}is not valid`;
        } else if (error.details[0].type === 'any.only') throw 'gender can be Male(M) or Female(F)';
        else throw error.details[0].message.replace(/[/"]/g, '');
      }
    } catch (err) {
      return res.status(400).send({
        status: 400,
        error: err
      });
    }
    if (users.find((el) => el.email === req.body.email)) {
      res.status(409).send({
        status: 409,
        error: 'Email already exists'
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          res.status(500).send({
            status: 500,
            error: 'Internal server error'
          });
        } else {
          const user = new User(
            req.body.firstName,
            req.body.lastName,
            req.body.email,
            hash,
            req.body.gender,
            req.body.jobRole,
            req.body.department,
            req.body.address
          );
          users.push(user);
          res.status(201).send({
            status: 201,
            message: 'User Account successfully created',
            data: {
              token: Helper.getToken(user)
            }
          });
        }
      });
    }
  }

  signIn(req, res) {
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
    } else {
      const user = users.find((el) => el.email === req.body.email);
      if (user) {
        bcrypt.compare(req.body.password, user.password, (_err, result) => {
          if (result) {
            if (user.isAdmin === true) {
              res.status(200).send({
                status: 200,
                message: 'Admin is successfully logged in',
                data: {
                  token: Helper.getToken(user)
                }
              });
            } else {
              res.status(200).send({
                status: 200,
                message: 'User is successfully logged in',
                data: {
                  token: Helper.getToken(user)
                }
              });
            }
          } else {
            res.status(401).send({
              status: 401,
              error: 'Password incorrect'
            });
          }
        });
      } else {
        res.status(404).send({
          status: 404,
          error: 'User not found'
        });
      }
    }
  }

  makeAdmin(req, res) {
    const user = users.find((el) => el.email === req.body.email);
    if (user) {
      user.isAdmin = true;
      res.status(201).send({
        status: 201,
        message: 'Admin created',
        data: {
          isAdmin: user.isAdmin,
        }

      });
    } else {
      res.status(404).send({
        status: 404,
        error: 'User not found'
      });
    }
  }

  deleteUser(req, res) {
    const user = users.find((el) => el.email === req.body.email);
    if (user) {
      const { isAdmin } = req.payload;
      if (isAdmin) {
        users.splice(users.indexOf(user), 1);
        res.status(200).send({
          status: 200,
          message: 'User successfully deleted'
        });
      } else {
        res.status(403).send({
          status: 403,
          error: 'Not Authorized'
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
