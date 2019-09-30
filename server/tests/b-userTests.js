import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();

let adminToken;

// Signing up
describe('Employee signup test: case 1', () => {
	it('it should sign up an employee', (done) => {
		const data = {
			firstName: 'Bran',
			lastName: 'Stark',
			email: 'bstark@gmail.com',
			password: 'Password@123',
			gender: 'male',
			jobRole: 'Software engineer',
			department: 'engineering',
			address: 'Houston'
		};
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
		const data = {
			firstName: 'Bran',
			lastName: 'stark',
			email: 'bstark@gmail.com',
			password: 'Password@123',
			department: 'engineering'
		};
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
		const data = {
			firstName: 'Bran',
			lastName: 'stark',
			email: 'bstark@gmail.com',
			password: 'Pass@1',
			gender: 'male',
			jobRole: 'Software engineer',
			department: 'engineering'
		};
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
		const data = {
			firstName: 'Bran',
			lastName: 'stark',
			email: 'bstark@gmail.com',
			password: 'Passwowow@!oword',
			gender: 'male',
			jobRole: 'Software engineer',
			department: 'engineering'
		};
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
		const data = {
			firstName: 'Bran',
			lastName: 'stark',
			email: 'bstark@gmail.com',
			password: 'Password123',
			gender: 'male',
			jobRole: 'Software engineer',
			department: 'engineering'
		};
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
		const data = {
			firstName: 'Bran',
			lastName: 'stark',
			email: 'bstark@gmail.com',
			password: 'password@123',
			gender: 'male',
			jobRole: 'Software engineer',
			department: 'engineering'
		};
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
		const data = {
			firstName: '1234',
			lastName: 'stark',
			email: 'bstark@gmail.com',
			password: 'Password@123',
			gender: 'male',
			jobRole: 'Software engineer',
			department: 'engineering'
		};
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
		const data = {
			firstName: 'Bran',
			lastName: '1234',
			email: 'bstark@gmail.com',
			password: 'Password@123',
			gender: 'male',
			jobRole: 'Software engineer',
			department: 'engineering'
		};
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
		const data = {
			firstName: 'Bran Bob',
			lastName: '1234',
			email: 'bstark@gmail.com',
			password: 'Password@123',
			gender: 'male',
			jobRole: 'Software engineer',
			department: 'engineering'
		};
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
		const data = {
			firstName: 'Bran',
			lastName: 'Stark Man',
			email: 'bstark@gmail.com',
			password: 'Password@123',
			gender: 'male',
			jobRole: 'Software engineer',
			department: 'engineering'
		};
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
		const data = {
			firstName: 'Bran',
			lastName: 'stark',
			email: 'bstark@gmail.com',
			password: 'Password@123',
			gender: 'ma',
			jobRole: 'Software engineer',
			department: 'engineering'
		};
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
		const data = {
			firstName: 'Ben',
			lastName: 'Gisa',
			email: 'bengisa@gmail.com',
			password: 'Password@123',
			gender: 'male',
			jobRole: 'Data analyst',
			department: 'Investigation'
		};
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
			.end((error, _res) => {
				if (error) done(error);
				done();
			});
	});

	it('it should not sign up an already existing employee', (done) => {
		const data = {
			firstName: 'Ben',
			lastName: 'Gisa',
			email: 'bengisa@gmail.com',
			password: 'Password@123',
			gender: 'male',
			jobRole: 'Data analyst',
			department: 'Investigation'
		};
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
		const data = {
			firstName: 'Ben',
			lastName: 'Gisa',
			email: 'bengisa@gmail.com',
			password: 'Password@123',
			gender: 'male',
			jobRole: 'Data analyst',
			department: 'Investigation'
		};
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
			.end((error) => {
				if (error) done(error);
				done();
			});
	});
	it('it should login an employee', (done) => {
		const data = {
			email: 'bengisa@gmail.com',
			password: 'Password@123'
		};
		chai.request(app)
			.post('/api/v1/auth/signin')
			.send(data)
			.end((_err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('status').eql(200);
				res.body.should.have.property('data');
				res.body.data.should.have.property('token');
				done();
			});
	});
	it('it should not login an employee with no email', (done) => {
		const data = {
			password: 'Password@123'
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
			email: 'bengisa@gmail.com',
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
		const data = {
			email: 'bengisa@gmail.com',
			password: 'Password@345'
		};
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
		const data = {
			email: 'brucesangwa@gmail.com',
			password: 'Password@123'
		};
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
			email: 'bengisa@gmail.com'
		};
		chai.request(app)
			.post('/api/v1/auth/users')
			.send(data)
			.end((_err, res) => {
				res.should.have.status(201);
				res.body.should.have.property('status').eql(201);
				res.body.should.have.property('message').eql('Admin created');
				done();
			});
	});

	it('should not create an admin from a non existing user', (done) => {
		const data = {
			email: 'brucesawa@gmail.com'
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
			email: 'brucesangwa@gmail.com'
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

});

describe('Deleting a user', () => {
	beforeEach('login the newly created admin', (done) => {
		const data = {
			email: 'bengisa@gmail.com',
			password: 'Password@123'
		};
		chai.request(app)
			.post('/api/v1/auth/signin')
			.send(data)
			.end((_err, res) => {
				console.log(res.body.token);
				
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

	it('admin delete a user', (done) => {
		const data = {
			email: 'bstark@gmail.com'
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
