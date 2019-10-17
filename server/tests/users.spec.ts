import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import mockData from "./mockData";

chai.use(chaiHttp);
chai.should();

describe('Version 1', () => {
  describe('Signup', () => {
    it('Successfully sign up an employee', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(mockData.baraka)
        .end((_err,res) => {
          res.should.have.status(201);
					res.body.should.have.property('status').eql(201);
					res.body.should.have.property('message').eql('User Account successfully created');
					res.body.should.have.property('data');
					res.body.data.should.have.property('token');
					done();
        })
    });
    it('Not sign up an already existing employee', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(mockData.baraka)
        .end((_err,res) => {
          res.should.have.status(409);
					res.body.should.have.property('status').eql(409);
          res.body.should.have.property('error').eql('Email already exists');
          done();
        });
    });
    it('Not sign up an employee with incomplete info', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(mockData.signupIncomplete)
        .end((_err,res) => {
          res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('gender is required');
					done();
        });
    });
    it('Not sign up an employee with a weak password', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(mockData.signupNoCharPwd)
        .end((_err,res) => {
          res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('password must not be less than 8 characters and must contain lowercase letters, uppercase letters, numbers and special characters');
					done();
        });
    });
    it('Not sign up an employee with an unclear gender', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(mockData.signupGenderUnclear)
        .end((_err,res) => {
          res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('gender can be Male(M) or Female(F)');
					done();
        });
    });
    it('Not sign up an employee with a first name with spaces', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(mockData.signupSpaceFname)
        .end((_err,res) => {
          res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('firstName is not valid');
					done();
        });
    });
  });
  describe('Login', () => {
    it('Successfully log in an employee', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(mockData.baraka)
        .end((_err,res) => {
          res.should.have.status(200);
					res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('User is successfully logged in');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          done();
        });
    });
    it('Not log in an employee who does not exist', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(mockData.jamesLogin)
        .end((_err,res) => {
          res.should.have.status(404);
					res.body.should.have.property('status').eql(404);
          res.body.should.have.property('error').eql('User not found');
          done();
        });
    });
  });
  describe('Alter users', () => {
    it('First sign up an employee', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(mockData.james)
        .end((_err,res) => {
					done();
        });
    });
    it('Make an admin', (done) => {
      chai.request(app)
        .post('/api/v1/auth/users/makeadmin')
        .send({ email: mockData.james.email })
        .end((_err,res) => {
          res.should.have.status(201);
					res.body.should.have.property('status').eql(201);
          res.body.should.have.property('message').eql('Admin created');
          res.body.should.have.property('data');
          res.body.data.should.have.property('isAdmin');
          done();
        });
    });
    it('Not make an inexisting user admin', (done) => {
      chai.request(app)
        .post('/api/v1/auth/users/makeadmin')
        .send({ email: 'gitegob@gmail.com' })
        .end((_err,res) => {
          res.should.have.status(404);
					res.body.should.have.property('status').eql(404);
          res.body.should.have.property('error').eql('User not found');
          done();
        });
    });
    it('Login the admin', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(mockData.jamesLogin)
        .end((_err,res) => {
          mockData.adminToken = res.body.data.token; 
          res.should.have.status(200);
					res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('Admin is successfully logged in');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          done();
        });
    });
    it('Delete a user', (done) => {
      chai.request(app)
        .delete('/api/v1/auth/users/delete')
        .set('Authorization', `Bearer ${mockData.adminToken}`)
        .send({ email: mockData.baraka.email })
        .end((_err, res) => {
          res.should.have.status(200);
					res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('User successfully deleted');
          done();
        });
    });
    it('Not delete an inexisting user', (done) => {
      chai.request(app)
        .delete('/api/v1/auth/users/delete')
        .set('Authorization', `Bearer ${mockData.adminToken}`)
        .send({ email: 'gitegob@gmail.com'})
        .end((_err, res) => {
          res.should.have.status(404);
					res.body.should.have.property('status').eql(404);
          res.body.should.have.property('error').eql('User not found');
          done();
        });
    });
  });
});