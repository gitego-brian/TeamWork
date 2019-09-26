import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();

let token;
let tokenTwo;
let adminToken;
let articleId;
let commentId;

// Articles
describe('Creating an article', () => {
	it('first sign up an employee', (done) => {
		const data = {
			firstName: 'Baraka',
			lastName: 'Mugisha',
			email: 'mugishaje@gmail.com',
			password: '12345678',
			gender: 'male',
			jobRole: 'Marketing assistant',
			department: 'Marketing',
			address: 'Houston'
		};
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
			.end((_err, res) => {
				token = res.body.data.token;
				done();
			});
	});

	it('first sign up another employee', (done) => {
		const data = {
			firstName: 'James',
			lastName: 'Nyagatare',
			email: 'jimnyagtr@gmail.com',
			password: 'complicatedpassword',
			gender: 'male',
			jobRole: 'Back-end developer',
			department: 'Web development',
			address: 'Gatenga'
		};
		chai.request(app)
			.post('/api/v1/auth/signup')
			.send(data)
			.end((_err, res) => {
				tokenTwo = res.body.data.token;
				done();
			});
	});

	it('Employee should create an article', (done) => {
		const data = {
			title: 'Just a sign',
			article: 'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?'
		};
		chai.request(app)
			.post('/api/v1/articles/')
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(201);
				res.body.should.have.property('status').eql(201);
				res.body.should.have.property('message').eql('Article successfully created');
				res.body.should.have.property('data');
				res.body.data.should.have.property('id');
				res.body.data.should.have.property('title').eql('Just a sign');
				res.body.data.should.have.property('article').eql('Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?');
				res.body.data.should.have.property('authorId');
				res.body.data.should.have.property('authorName');
				done();
			});
	});

	it('Employee should not create an article if not signed up', (done) => {
		const data = {
			title: 'Just a sign',
			article: 'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?',
		};
		chai.request(app)
			.post('/api/v1/articles/')
			.send(data)
			.end((_err, res) => {
				res.should.have.status(401);
				res.body.should.have.property('status').eql(401);
				res.body.should.have.property('error').eql('Please log in or sign up first');
				done();
			});
	});

	it('Employee should not create an article with an invalid token', (done) => {
		const data = {
			title: 'Just a sign',
			article: 'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?',
		};
		chai.request(app)
			.post('/api/v1/articles/')
			.set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTMwMGViODQwIiwiZW1haWwiOiJrYWxpc2FAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoiQ2hyaXN0aWFuIiwibGFzdE5hbWUiOiJLYWxpc2EiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTY5MzI4MjY5fQ.Rzbk2yB0hM-vUV5OokmiIHT7IrTIPDuFXE3VYekDeo0')
			.send(data)
			.end((_err, res) => {
				res.should.have.status(401);
				res.body.should.have.property('status').eql(401);
				res.body.should.have.property('error').eql('Invalid token');
				done();
			});
	});

	it('Employee should not create an article if title is too short', (done) => {
		const data = {
			title: 'J',
			article: 'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?',
		};
		chai.request(app)
			.post('/api/v1/articles/')
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('title length must be at least 5 characters long');

				done();
			});
	});

	it('Employee should not create an article if article is too short', (done) => {
		const data = {
			title: 'Just a sign',
			article: 'Looking',
		};
		chai.request(app)
			.post('/api/v1/articles/')
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('article length must be at least 20 characters long');

				done();
			});
	});
});
// VIEWING AND SHARING ARTICLES
describe('Viewing and sharing articles', () => {
	beforeEach('create an article', (done) => {
		const data = {
			title: 'Just another sign',
			article: 'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?'
		};
		chai.request(app)
			.post('/api/v1/articles/')
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				articleId = res.body.data.id;
				res.should.have.status(201);
				res.body.should.have.property('status').eql(201);
				res.body.should.have.property('message').eql('Article successfully created');
				done();
			});
	});

	it('Employee should view all articles', (done) => {
		chai.request(app)
			.get('/api/v1/articles/')
			.set('Authorization', `Bearer ${token}`)
			.end((_err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('status').eql(200);
				res.body.should.have.property('message').eql('Success');
				res.body.should.have.property('data');
				res.body.data.should.have.property('articles');
				done();
			});
	});
	it('Employee should not be able to view all articles if he/she is not signed up', (done) => {
		chai.request(app)
			.get('/api/v1/articles/')
			.end((_err, res) => {
				res.should.have.status(401);
				res.body.should.have.property('status').eql(401);
				res.body.should.have.property('error').eql('Please log in or sign up first');
				done();
			});
	});
	it('Employee should be able to view a single article', (done) => {
		chai.request(app)
			.get(`/api/v1/articles/${articleId}`)
			.set('Authorization', `Bearer ${token}`)
			.end((_err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('status').eql(200);
				res.body.should.have.property('message').eql('Success');
				res.body.should.have.property('data');
				res.body.data.should.have.property('article');
				done();
			});
	});
	it('Employee should not be able to view a single article if he/she is not signed up', (done) => {
		chai.request(app)
			.get(`/api/v1/articles/${articleId}`)
			.end((_err, res) => {
				res.should.have.status(401);
				res.body.should.have.property('status').eql(401);
				res.body.should.have.property('error').eql('Please log in or sign up first');
				done();
			});
	});
	it('Employee should not be able to view a non-existing article', (done) => {
		chai.request(app)
			.get('/api/v1/articles/100')
			.set('Authorization', `Bearer ${token}`)
			.end((_err, res) => {
				res.should.have.status(404);
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('Article not found');
				done();
			});
	});

	it('Employee should share an article', (done) => {
		chai.request(app)
			.post(`/api/v1/articles/${articleId}`)
			.set('Authorization', `Bearer ${tokenTwo}`)
			.end((_err, res) => {
				res.should.have.status(201);
				res.body.should.have.property('status').eql(201);
				res.body.should.have.property('message').eql('Article successfully shared');
				res.body.should.have.property('data');
				res.body.data.should.have.property('article');
				res.body.data.article.should.have.property('sharedBy');
				done();
			});
	});

	it('Employee should not be able to share a non-existing article', (done) => {
		chai.request(app)
			.post('/api/v1/articles/100')
			.set('Authorization', `Bearer ${tokenTwo}`)
			.end((_err, res) => {
				res.should.have.status(404);
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('Article not found');
				done();
			});
	});

	it('Employee should not be able to share an article if not logged in or signed up', (done) => {
		chai.request(app)
			.post(`/api/v1/articles/${articleId}`)
			.end((_err, res) => {
				res.should.have.status(401);
				res.body.should.have.property('status').eql(401);
				res.body.should.have.property('error').eql('Please log in or sign up first');
				done();
			});
	});
});

// Employee can edit, delete and update his articles

describe('Employee can change his articles', () => {
	beforeEach('create an article', (done) => {
		const data = {
			title: 'Just another sign',
			article: 'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?'
		};
		chai.request(app)
			.post('/api/v1/articles/')
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				articleId = res.body.data.id;
				res.should.have.status(201);
				res.body.should.have.property('status').eql(201);
				done();
			});
	});
	it('Employee can edit an article', (done) => {
		const data = {
			title: 'This sign has just been edited',
			article: 'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?'
		};
		chai.request(app)
			.patch(`/api/v1/articles/${articleId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('status').eql(200);
				res.body.should.have.property('message').eql('Article successfully edited');
				res.body.should.have.property('data');
				res.body.data.should.have.property('updatedArticle');
				res.body.data.updatedArticle.should.have.property('title').eql('This sign has just been edited');
				res.body.data.updatedArticle.should.have.property('article').eql('Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?');
				done();
			});
	});

	it('user cannot edit an article if not logged in or signed up', (done) => {
		const data = {
			title: 'This sign has just been edited',
			article: 'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?'
		};
		chai.request(app)
			.patch(`/api/v1/articles/${articleId}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(401);
				res.body.should.have.property('status').eql(401);
				res.body.should.have.property('error').eql('Please log in or sign up first');
				done();
			});
	});

	it('Employee cannot edit a non existing article', (done) => {
		const data = {
			title: 'This sign has just been edited',
			article: 'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?'
		};
		chai.request(app)
			.patch('/api/v1/articles/100')
			.send(data)
			.set('Authorization', `Bearer ${token}`)
			.end((_err, res) => {
				res.should.have.status(404);
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('Article not found');
				done();
			});
	});

	it('Employee cannot edit an article if no article or title is provided', (done) => {
		const data = {

		};
		chai.request(app)
			.patch(`/api/v1/articles/${articleId}`)
			.send(data)
			.set('Authorization', `Bearer ${token}`)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('Can\'t update if no changes made');
				done();
			});
	});

	it('Employee can delete an article', (done) => {
		chai.request(app)
			.delete(`/api/v1/articles/${articleId}`)
			.set('Authorization', `Bearer ${token}`)
			.end((_err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('status').eql(200);
				res.body.should.have.property('data');
				res.body.should.have.property('message').eql('Article successfully deleted');
				res.body.data.should.have.property('article');
				done();
			});
	});

	it('Employee cannot delete an article if not logged in or signed up', (done) => {
		chai.request(app)
			.delete(`/api/v1/articles/${articleId}`)
			.end((_err, res) => {
				res.should.have.status(401);
				res.body.should.have.property('status').eql(401);
				res.body.should.have.property('error').eql('Please log in or sign up first');
				done();
			});
	});

	it('Employee cannot delete a non-existent article', (done) => {
		chai.request(app)
			.delete('/api/v1/articles/100')
			.set('Authorization', `Bearer ${token}`)
			.end((_err, res) => {
				res.should.have.status(404);
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('Article not found');
				done();
			});
	});

	it('Employee can comment on an article', (done) => {
		const data = {
			comment: 'Great'
		};
		chai.request(app)
			.post(`/api/v1/articles/${articleId}/comments`)
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(201);
				res.body.should.have.property('status').eql(201);
				res.body.should.have.property('message').eql('Comment posted successfully');
				res.body.should.have.property('data');
				res.body.data.should.have.property('articleTitle');
				res.body.data.should.have.property('comment');
				res.body.data.comment.should.have.property('comment').eql('Great');
				done();
			});
	});

	it('Employee cannot comment on a non-existent article', (done) => {
		const data = {
			comment: 'Great'
		};
		chai.request(app)
			.post('/api/v1/articles/100/comments')
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(404);
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('Article not found');
				done();
			});
	});

	it('Employee cannot comment an article if not logged in', (done) => {
		const data = {
			comment: 'Great'
		};
		chai.request(app)
			.post(`/api/v1/articles/${articleId}/comments`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(401);
				res.body.should.have.property('status').eql(401);
				res.body.should.have.property('error').eql('Please log in or sign up first');
				done();
			});
	});

	it('Employee cannot comment on an article if no comment is provided', (done) => {
		const data = {};
		chai.request(app)
			.post(`/api/v1/articles/${articleId}/comments`)
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('You didn\'t write anything');
				done();
			});
	});

	it('Employee cannot comment on an article if the comment is only spaces', (done) => {
		const data = {
			comment: '  '
		};
		chai.request(app)
			.post(`/api/v1/articles/${articleId}/comments`)
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('comment is not allowed to be empty');
				done();
			});
	});

	it('Employee cannot comment on an article if the comment is an empty string', (done) => {
		const data = {
			comment: ''
		};
		chai.request(app)
			.post(`/api/v1/articles/${articleId}/comments`)
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('comment is not allowed to be empty');
				done();
			});
	});


	it('Admin should log in', (done) => {
		const data = {
			email: 'gitegob@gmail.com',
			password: 'gitegob@123'
		};
		chai.request(app)
			.post('/api/v1/auth/signin')
			.send(data)
			.end((_err, res) => {
				// eslint-disable-next-line prefer-destructuring
				adminToken = res.body.data.token;
				res.should.have.status(200);
				res.body.should.have.property('status').eql(200);
				res.body.should.have.property('data');
				res.body.should.have.property('message').eql('Admin is successfully logged in');
				res.body.data.should.have.property('token');
				done();
			});
	});

	it('Employee cannot edit another employee\'s article', (done) => {
		const data = {
			title: 'Just another edited sign',
			article: 'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?'
		};
		chai.request(app)
			.patch(`/api/v1/articles/${articleId}`)
			.send(data)
			.set('Authorization', `Bearer ${tokenTwo}`)
			.end((_err, res) => {
				res.should.have.status(403);
				res.body.should.have.property('status').eql(403);
				res.body.should.have.property('error').eql('Not Authorized');
				done();
			});
	});

	it('Employee cannot delete another employee\'s article', (done) => {
		chai.request(app)
			.delete(`/api/v1/articles/${articleId}`)
			.set('Authorization', `Bearer ${tokenTwo}`)
			.end((_err, res) => {
				res.should.have.status(403);
				res.body.should.have.property('status').eql(403);
				res.body.should.have.property('error').eql('Not Authorized');
				done();
			});
	});

	it('Admin can delete another employee\'s article', (done) => {
		chai.request(app)
			.delete(`/api/v1/articles/${articleId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.end((_err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('status').eql(200);
				res.body.should.have.property('data');
				res.body.should.have.property('message').eql('Article successfully deleted');
				res.body.data.should.have.property('article');
				done();
			});
	});

	it('Admin can edit another employee\'s article', (done) => {
		const data = {
			title: 'Just another sign edited by the admin',
			article: 'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?'
		};
		chai.request(app)
			.patch(`/api/v1/articles/${articleId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('status').eql(200);
				res.body.should.have.property('message').eql('Article successfully edited');
				res.body.should.have.property('data');
				res.body.data.should.have.property('updatedArticle');
				res.body.data.updatedArticle.should.have.property('title').eql('Just another sign edited by the admin');
				res.body.data.updatedArticle.should.have.property('article').eql('Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?');
				done();
			});
	});
});

describe('Comments', () => {
	beforeEach('Comment on an article', (done) => {
		const data = {
			comment: 'Great'
		};
		chai.request(app)
			.post(`/api/v1/articles/${articleId}/comments`)
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				commentId = res.body.data.comment.id;
				done();
			});
	});
	it('Employee can flag a comment', (done) => {
		const data = {
			reason: 'inappropriate'
		};
		chai.request(app)
			.post(`/api/v1/articles/${articleId}/comments/${commentId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(201);
				res.body.should.have.property('status').eql(201);
				res.body.should.have.property('message').eql('Comment flagged!');
				res.body.should.have.property('data');
				res.body.data.should.have.property('comment');
				res.body.data.should.have.property('flag');
				res.body.data.flag.should.have.property('id');
				res.body.data.flag.should.have.property('reason').eql('inappropriate');
				res.body.data.flag.should.have.property('flaggedBy');
				res.body.data.flag.should.have.property('flaggedOn');
				done();
			});
	});

	it('Employee cannot flag a comment if not logged in or signed up', (done) => {
		const data = {
			reason: 'inappropriate'
		};
		chai.request(app)
			.post(`/api/v1/articles/${articleId}/comments/${commentId}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(401);
				res.body.should.have.property('status').eql(401);
				res.body.should.have.property('error').eql('Please log in or sign up first');
				done();
			});
	});

	it('Employee cannot flag a comment if the reason is too short', (done) => {
		const data = {
			reason: 'dumb'
		};
		chai.request(app)
			.post(`/api/v1/articles/${articleId}/comments/${commentId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('That reason may not be understandable, Care to elaborate?');
				done();
			});
	});

	it('Employee cannot flag an non-existing comment', (done) => {
		const data = {
			reason: 'inappropriate'
		};
		chai.request(app)
			.post(`/api/v1/articles/${articleId}/comments/100`)
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(404);
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('Comment not found');
				done();
			});
	});

	it('Employee cannot flag a comment if the article doesn\'t exist', (done) => {
		const data = {
			reason: 'inappropriate'
		};
		chai.request(app)
			.post(`/api/v1/articles/100/comments/${commentId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(404);
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('Article not found');
				done();
			});
	});

	it('Employee cannot flag a comment with empty reason', (done) => {
		const data = {
			reason: ''
		};
		chai.request(app)
			.post(`/api/v1/articles/${articleId}/comments/${commentId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('Can\'t flag comment, no reason provided');
				done();
			});
	});

	it('Employee cannot flag a comment with no reason', (done) => {
		const data = {};
		chai.request(app)
			.post(`/api/v1/articles/${articleId}/comments/${commentId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('Can\'t flag comment, no reason provided');
				done();
			});
	});

	it('Admin cannot delete an unflagged comment', (done) => {
		chai.request(app)
			.delete(`/api/v1/articles/${articleId}/comments/${commentId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.end((_err, res) => {
				res.should.have.status(403);
				res.body.should.have.property('status').eql(403);
				res.body.should.have.property('error').eql('Cannot delete an unflagged comment');
				done();
			});
	});

	it('Admin cannot delete a non-existing comment', (done) => {
		chai.request(app)
			.delete(`/api/v1/articles/${articleId}/comments/100`)
			.set('Authorization', `Bearer ${adminToken}`)
			.end((_err, res) => {
				res.should.have.status(404);
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('Comment not found');
				done();
			});
	});

	it('Admin cannot delete a comment if the article does not exist', (done) => {
		chai.request(app)
			.delete(`/api/v1/articles/100/comments/${commentId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.end((_err, res) => {
				res.should.have.status(404);
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('Article not found');
				done();
			});
	});

	it('Employee cannot delete another employee\'s  comment', (done) => {
		chai.request(app)
			.delete(`/api/v1/articles/${articleId}/comments/${commentId}`)
			.set('Authorization', `Bearer ${tokenTwo}`)
			.end((_err, res) => {
				res.should.have.status(403);
				res.body.should.have.property('status').eql(403);
				res.body.should.have.property('error').eql('Not Authorized');
				done();
			});
	});

	it('Employee can delete his/her own comment', (done) => {
		chai.request(app)
			.delete(`/api/v1/articles/${articleId}/comments/${commentId}`)
			.set('Authorization', `Bearer ${token}`)
			.end((_err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('status').eql(200);
				res.body.should.have.property('data');
				res.body.should.have.property('message').eql('Comment successfully deleted');
				res.body.data.should.have.property('comment');
				done();
			});
	});
});
describe('Deleting flagged comments', () => {
	beforeEach('Comment on an article', (done) => {
		const data = {
			comment: 'Great'
		};
		chai.request(app)
			.post(`/api/v1/articles/${articleId}/comments`)
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				commentId = res.body.data.comment.id;
				done();
			});
	});
	beforeEach('Flag a comment', (done) => {
		const data = {
			reason: 'inappropriate'
		};
		chai.request(app)
			.post(`/api/v1/articles/${articleId}/comments/${commentId}`)
			.set('Authorization', `Bearer ${tokenTwo}`)
			.send(data)
			.end((err, _res) => {
				if (err) done(err);
				done();
			});
	});

	it('Employee cannot delete a comment even if it is flagged', (done) => {
		chai.request(app)
			.delete(`/api/v1/articles/${articleId}/comments/${commentId}`)
			.set('Authorization', `Bearer ${tokenTwo}`)
			.end((_err, res) => {
				res.should.have.status(403);
				res.body.should.have.property('status').eql(403);
				res.body.should.have.property('error').eql('Not Authorized');
				done();
			});
	});
	it('Admin can delete a flagged comment', (done) => {
		chai.request(app)
			.delete(`/api/v1/articles/${articleId}/comments/${commentId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.end((_err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('status').eql(200);
				res.body.should.have.property('data');
				res.body.should.have.property('message').eql('Comment successfully deleted');
				res.body.data.should.have.property('comment');
				done();
			});
	});
});
