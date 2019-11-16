import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();

// WELCOME PAGE
describe('App tests', () => {
	it('should display a welcome message', (done) => {
		chai
			.request(app)
			.get('/')
			.end((_err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('status').eql(200);
				res.body.should.have
					.property('message')
					.eql(
						'Welcome to TeamWork!, go to  https://documenter.getpostman.com/view/8741834/SVtPXARF?version=latest  or go to the REPO at https://github.com/gitego-brian/TeamWork for documentation'
					);
				done();
			});
	});
});

// INVALID ROUTES
describe('Handle invalid routes', () => {
	it('should display an error message', (done) => {
		chai
			.request(app)
			.get('/hiuhukhoih')
			.end((_err, res) => {
				res.should.have.status(404);
				res.body.should.be.a('object');
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('Not Found');
				done();
			});
	});

	it('should display an error message on invalid route', (done) => {
		chai
			.request(app)
			.post('/hiuhukhoih')
			.end((_err, res) => {
				res.should.have.status(404);
				res.body.should.be.a('object');
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('Not Found');
				done();
			});
	});

	it('should display an error message on invalid route', (done) => {
		chai
			.request(app)
			.patch('/hiuhukhoih')
			.end((_err, res) => {
				res.should.have.status(404);
				res.body.should.be.a('object');
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('Not Found');
				done();
			});
	});

	it('should display an error message on invalid route', (done) => {
		chai
			.request(app)
			.delete('/hiuhukhoih')
			.end((_err, res) => {
				res.should.have.status(404);
				res.body.should.be.a('object');
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('Not Found');
				done();
			});
	});
});
