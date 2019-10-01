import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import mockData from './mockData';

chai.use(chaiHttp);
chai.should();

let token;
let adminToken;

// Signing up
describe('Employee signup test: case 1', () => {
	it('it should sign up an employee', (done) => {
		const data = mockData.signupComplete1;
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
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
		const data = mockData.signupIncomplete;
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('gender is required');
				done();
			});
	});

	it('it should not sign up an employee  account when password is less than 8 characters', (done) => {
		const data = mockData.signupShortPwd;
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('password must not be less than 8 characters and must contain lowercase letters, uppercase letters, numbers and special characters');
				done();
			});
	});

	it('it should not sign up an employee  account when password contains no numbers', (done) => {
		const data = mockData.signupNoNumPwd;
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('password must not be less than 8 characters and must contain lowercase letters, uppercase letters, numbers and special characters');
				done();
			});
	});

	it('it should not sign up an employee  account when password contains no special characters ', (done) => {
		const data = mockData.signupNoCharPwd;
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('password must not be less than 8 characters and must contain lowercase letters, uppercase letters, numbers and special characters');
				done();
			});
	});

	it('it should not sign up an employee  account when password contains no uppercase letter ', (done) => {
		const data = mockData.signupNoUcasePwd;
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('password must not be less than 8 characters and must contain lowercase letters, uppercase letters, numbers and special characters');
				done();
			});
	});

	it('it should not sign up an employee  account when the firstname is numbers', (done) => {
		const data = mockData.signupNumFname;
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('firstName is not valid');
				done();
			});
	});

	it('it should not sign up an employee  account when the lastName is numbers', (done) => {
		const data = mockData.signupNumLname;
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('lastName is not valid');
				done();
			});
	});

	it('it should not sign up an employee  account when the firstName contains a whitespace', (done) => {
		const data = mockData.signupSpaceFname;
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('firstName is not valid');
				done();
			});
	});

	it('it should not sign up an employee  account when the lastName contains a whitespace', (done) => {
		const data = mockData.signupSpaceLname;
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('lastName is not valid');
				done();
			});
	});

	it('it should not sign up an employee  account when gender is not clear', (done) => {
		const data = mockData.signupGenderUnclear;
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
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
		const data = mockData.signupComplete2;
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
			.end((error, _res) => {
				if (error) done(error);
				done();
			});
	});

	it('it should not sign up an already existing employee', (done) => {
		const data = mockData.signupComplete2;
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
			.end((_err, res) => {
				res.body.should.have.property('status').eql(403);
				res.body.should.have.property('error').eql('Email already exists');
			});
		done();
	});
});


// Logging in

describe('Employee Login test', () => {
	beforeEach('Create an employee', (done) => {
		const data = mockData.signupComplete2;
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
			.end((error) => {
				if (error) done(error);
				done();
			});
	});
	it('it should login an employee', (done) => {
		const data = mockData.loginComplete;
		chai.request(app)
			.post('/api/v1/auth/signin')
			.send(data)
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
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('email is required');
				done();
			});
	});
	it('it should not login an employee with no password', (done) => {
		const data = {
			email: mockData.loginComplete.email
		};
		chai.request(app)
			.post('/api/v1/auth/signin')
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('password is required');
				done();
			});
	});

	it('it should not login an employee with wrong password', (done) => {
		const data = mockData.loginWrongPwd;
		chai.request(app)
			.post('/api/v1/auth/signin')
			.send(data)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.have.property('status').eql(401);
				res.body.should.have.property('error').eql('Password incorrect');
				done();
			});
	});

	it('it should not login an employee who does not have account', (done) => {
		const data = mockData.loginNoAccount;
		chai.request(app)
			.post('/api/v1/auth/signin')
			.send(data)
			.end((err, res) => {
				res.should.have.status(404);
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('User not found');
				done();
			});
	});

	it('should create an admin from a normal user', (done) => {
		const data = {
			email: mockData.loginComplete.email
		};
		chai.request(app)
			.post('/api/v1/auth/users')
			.send(data)
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
		const data = {
			email: mockData.loginNoAccount.email
		};
		chai.request(app)
			.post('/api/v1/auth/users')
			.send(data)
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
			.delete('/api/v1/auth/users')
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
		const data = {
			email: 'bran@gmail.com'
		};
		chai.request(app)
			.delete('/api/v1/auth/users')
			.set('Authorization', `Bearer ${adminToken}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(404);
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('User not found');
				done();
			});
	});

	it('admin can delete a user', (done) => {
		const data = {
			email: mockData.signupComplete1.email
		};
		chai.request(app)
			.delete('/api/v1/auth/users')
			.set('Authorization', `Bearer ${adminToken}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('status').eql(200);
				res.body.should.have.property('message').eql('User successfully deleted');
				done();
			});
	});
});
