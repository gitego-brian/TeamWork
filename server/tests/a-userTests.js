import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();

// WELCOME PAGE
describe('Welcome', () => {
	it('should display a welcome message', (done) => {
		chai.request(app)
			.get('/')
			.end((_err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('status').eql(200);
				res.body.should.have.property('message').eql('Welcome to TeamWork!');
				done();
			});
	});
});

// Signing up
describe('Employee signup test: case 1', () => {
	it('it should sign up an employee', (done) => {
		const data = {
			firstName: 'Bran',
			lastName: 'Stark',
			email: 'bstark@gmail.com',
			password: 'gitegob8890',
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
				res.body.data.should.have.property('id');
				res.body.data.should.have.property('token');
				res.body.data.should.have.property('firstName').eql('Bran');
				res.body.data.should.have.property('lastName').eql('Stark');
				res.body.data.should.have.property('email').eql('bstark@gmail.com');
				res.body.data.should.not.have.property('password');
				res.body.data.should.have.property('gender').eql('male');
				res.body.data.should.have.property('jobRole').eql('Software engineer');
				res.body.data.should.have.property('department').eql('engineering');
				res.body.data.should.have.property('address').eql('Houston');
				done();
			});
	});


	it('it should not create an employee account with incomplete info', (done) => {
		const data = {
			firstName: 'Bran',
			lastName: 'stark',
			email: 'bstark@gmail.com',
			password: 'gitegob8890',
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
			password: 'git',
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
				res.body.should.have.property('error').eql('password is not valid');
				done();
			});
	});

	it('it should not sign up an employee  account when the firstname is numbers', (done) => {
		const data = {
			firstName: '1234',
			lastName: 'stark',
			email: 'bstark@gmail.com',
			password: 'git',
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
			password: 'git',
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
			password: 'git',
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
			password: 'git',
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
			password: 'gitegob8890',
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
			password: 'monsieurmsolin',
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
			password: 'monsieurmsolin',
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
			password: 'monsieurmsolin',
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
			password: 'monsieurmsolin'
		};
		chai.request(app)
			.post('/api/v1/auth/signin')
			.send(data)
			.end((_err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('status').eql(200);
				res.body.should.have.property('data');
				res.body.data.should.have.property('token');
				res.body.data.should.have.property('id');
				res.body.data.should.have.property('firstName').eql('Ben');
				res.body.data.should.have.property('lastName').eql('Gisa');
				res.body.data.should.have.property('email').eql('bengisa@gmail.com');
				done();
			});
	});
	it('it should not login an employee with no email', (done) => {
		const data = {
			password: 'monsieurmsolin'
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
			password: 'mistermsolin'
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
			password: 'udontevenknow'
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
});
