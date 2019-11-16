import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import mockData from './mockData';

chai.use(chaiHttp);
chai.should();

let token;
let adminToken;

// VERSION ONE

describe('Version one', () => {
	// Signing up
	describe('Employee signup test: case 1', () => {
		it('it should sign up an employee', (done) => {
			chai.request(app)
				.post('/api/v1/auth/signup')
				.send(mockData.signupComplete1)
				.end((_err, res) => {
					res.should.have.status(201);
					res.body.should.have.property('status').eql(201);
					res.body.should.have.property('message').eql('User Account successfully created');
					res.body.should.have.property('data');
					res.body.data.should.have.property('token');
					done();
				});
		});


		it('it should not create an employee account with incomplete info', (done) => {
			chai.request(app)
				.post('/api/v1/auth/signup')
				.send(mockData.signupIncomplete)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('gender is required');
					done();
				});
		});

		it('it should not sign up an employee  account when password is weak ', (done) => {
			chai.request(app)
				.post('/api/v1/auth/signup')
				.send(mockData.signupNoCharPwd)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('password must not be less than 8 characters and must contain lowercase letters, uppercase letters, numbers and special characters');
					done();
				});
		});

		it('it should not sign up an employee  account when the info is invalid', (done) => {
			chai.request(app)
				.post('/api/v1/auth/signup')
				.send(mockData.signupNumFname)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('firstName is not valid');
					done();
				});
		});

		it('it should not sign up an employee  account when gender is not clear', (done) => {
			chai.request(app)
				.post('/api/v1/auth/signup')
				.send(mockData.signupGenderUnclear)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('gender can be Male(M) or Female(F)');
					done();
				});
		});
	});

	describe('Employee sign up test: case 2', () => {
		beforeEach('sign up an employee', (done) => {
			chai.request(app)
				.post('/api/v1/auth/signup')
				.send(mockData.signupComplete2)
				.end((error, _res) => {
					if (error) done(error);
					done();
				});
		});

		it('it should not sign up an already existing employee', (done) => {
			chai.request(app)
				.post('/api/v1/auth/signup')
				.send(mockData.signupComplete2)
				.end((_err, res) => {
					res.should.have.status(409);
					res.body.should.have.property('status').eql(409);
					res.body.should.have.property('error').eql('Email already exists');
				});
			done();
		});
	});


	// Logging in

	describe('Employee Login test', () => {
		it('Create an employee', (done) => {
			chai.request(app)
				.post('/api/v1/auth/signup')
				.send(mockData.signupComplete2)
				.end((error) => {
					if (error) done(error);
					done();
				});
		});
		it('it should login an employee', (done) => {
			chai.request(app)
				.post('/api/v1/auth/signin')
				.send(mockData.loginComplete)
				.end((_err, res) => {
					token = res.body.data.token;
					res.should.have.status(200);
					res.body.should.have.property('status').eql(200);
					res.body.should.have.property('data');
					res.body.data.should.have.property('token');
					done();
				});
		});
		it('it should not login an employee with no email', (done) => {
			const data = {
				password: mockData.loginComplete.password
			};
			chai.request(app)
				.post('/api/v1/auth/signin')
				.send(({}))
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('email is required');
					done();
				});
		});

		it('it should not login an employee with wrong password', (done) => {
			chai.request(app)
				.post('/api/v1/auth/signin')
				.send(mockData.loginWrongPwd)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.have.property('status').eql(401);
					res.body.should.have.property('error').eql('Password incorrect');
					done();
				});
		});

		it('it should not login an employee who does not have account', (done) => {
			chai.request(app)
				.post('/api/v1/auth/signin')
				.send(mockData.loginNoAccount)
				.end((_err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('status').eql(404);
					res.body.should.have.property('error').eql('User not found');
					done();
				});
		});

		it('should create an admin from a normal user', (done) => {
			chai.request(app)
				.post('/api/v1/auth/users/makeadmin')
				.send({email: mockData.loginComplete.email})
				.end((_err, res) => {
					res.should.have.status(201);
					res.body.should.have.property('status').eql(201);
					res.body.should.have.property('message').eql('Admin created');
					res.body.should.have.property('data');
					res.body.data.should.have.property('isAdmin').eql(true);
					done();
				});
		});

		it('should not create an admin from a non existing user', (done) => {
			chai.request(app)
				.post('/api/v1/auth/users/makeadmin')
				.send({email: mockData.loginNoAccount.email})
				.end((_err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('status').eql(404);
					res.body.should.have.property('error').eql('User not found');
					done();
				});
		});

		it('Non-admin cannot delete a user', (done) => {
			const data = {
				email: mockData.signupComplete1.email
			};
			chai.request(app)
				.delete('/api/v1/auth/users/delete')
				.set('Authorization', `Bearer ${token}`)
				.send(data)
				.end((_err, res) => {
					res.should.have.status(403);
					res.body.should.have.property('status').eql(403);
					res.body.should.have.property('error').eql('Not Authorized');
					done();
				});
		});
	});

	describe('Deleting a user', () => {
		beforeEach('login the newly created admin', (done) => {
			const data = {
				email: mockData.loginComplete.email,
				password: mockData.loginComplete.password
			};
			chai.request(app)
				.post('/api/v1/auth/signin')
				.send(data)
				.end((_err, res) => {
					adminToken = res.body.data.token;
					done();
				});
		});

		it('admin cannot delete a non-existing user', (done) => {
			chai.request(app)
				.delete('/api/v1/auth/users/delete')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({email: 'bran@gmail.com'})
				.end((_err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('status').eql(404);
					res.body.should.have.property('error').eql('User not found');
					done();
				});
		});

		it('admin can delete a user', (done) => {
			chai.request(app)
				.delete('/api/v1/auth/users/delete')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({email: mockData.signupComplete1.email})
				.end((_err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('status').eql(200);
					res.body.should.have.property('message').eql('User successfully deleted');
					done();
				});
		});
	});
});


describe('Version Two', () => {
	describe('Employee signup test: case 1', () => {
		it('it should sign up an employee', (done) => {
			chai.request(app)
				.post('/api/v2/auth/signup')
				.send(mockData.signupComplete1)
				.end((_err, res) => {
					res.should.have.status(201);
					res.body.should.have.property('status').eql(201);
					res.body.should.have.property('message').eql('User Account successfully created');
					res.body.should.have.property('data');
					res.body.data.should.have.property('token');
					done();
				});
		});
		it('it should not create an employee account with incomplete info', (done) => {
			chai.request(app)
				.post('/api/v2/auth/signup')
				.send(mockData.signupIncomplete)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('gender is required');
					done();
				});
		});

		it('it should not sign up an employee  account when password is weak', (done) => {
			chai.request(app)
				.post('/api/v2/auth/signup')
				.send(mockData.signupShortPwd)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('password must not be less than 8 characters and must contain lowercase letters, uppercase letters, numbers and special characters');
					done();
				});
		});

		it('it should not sign up an employee  account when the info is invalid', (done) => {
			chai.request(app)
				.post('/api/v2/auth/signup')
				.send(mockData.signupNumFname)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('firstName is not valid');
					done();
				});
		});

		it('it should not sign up an employee  account when gender is not clear', (done) => {
			chai.request(app)
				.post('/api/v2/auth/signup')
				.send(mockData.signupGenderUnclear)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('gender can be Male(M) or Female(F)');
					done();
				});
		});
	});
	describe('Employee Login test', () => {

		it('it should not login an employee with no email', (done) => {
			const data = {
				password: mockData.loginComplete.password
			};
			chai.request(app)
				.post('/api/v2/auth/signin')
				.send(data)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('email is required');
					done();
				});
		});
	});
});
