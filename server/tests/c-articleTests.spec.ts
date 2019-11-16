import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import mockData from './mockData';

chai.use(chaiHttp);
chai.should();

let token;
let tokenTwo;
let adminToken;
let articleId;
let commentId;

describe('Version one', () => {
	// Articles
	describe('Creating an article', () => {
		it('first sign up an employee', (done) => {
			chai.request(app)
				.post('/api/v1/auth/signup')
				.send(mockData.baraka)
				.end((_err, res) => {
					token = res.body.data.token;
					done();
				});
		});

		it('first sign up another employee', (done) => {
			chai.request(app)
				.post('/api/v1/auth/signup')
				.send(mockData.james)
				.end((_err, res) => {
					tokenTwo = res.body.data.token;
					done();
				});
		});

		it('Employee should create an article', (done) => {
			chai.request(app)
				.post('/api/v1/articles/')
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.article)
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
			chai.request(app)
				.post('/api/v1/articles/')
				.send(mockData.article)
				.end((_err, res) => {
					res.should.have.status(401);
					res.body.should.have.property('status').eql(401);
					res.body.should.have.property('error').eql('Please log in or sign up first');
					done();
				});
		});

		it('Employee should not create an article with an invalid token', (done) => {
			chai.request(app)
				.post('/api/v1/articles/')
				.set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTMwMGViODQwIiwiZW1haWwiOiJrYWxpc2FAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoiQ2hyaXN0aWFuIiwibGFzdE5hbWUiOiJLYWxpc2EiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTY5MzI4MjY5fQ.Rzbk2yB0hM-vUV5OokmiIHT7IrTIPDuFXE3VYekDeo0')
				.send(mockData.article)
				.end((_err, res) => {
					res.should.have.status(401);
					res.body.should.have.property('status').eql(401);
					res.body.should.have.property('error').eql('Invalid token');
					done();
				});
		});

		it('Employee should not create an article if title or article is too short', (done) => {
			chai.request(app)
				.post('/api/v1/articles/')
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.shortTitle)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('title length must be at least 5 characters long');

					done();
				});
		});
		it('Employee should not create an article if article already exists', (done) => {
			chai.request(app)
				.post('/api/v1/articles/')
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.article)
				.end((_err, res) => {
					res.should.have.status(409);
					res.body.should.have.property('status').eql(409);
					res.body.should.have.property('error').eql('Article already exists');
					done();
				});
		});
	});
	// VIEWING AND SHARING ARTICLES
	describe('Viewing and sharing articles', () => {
		beforeEach('create an article', (done) => {
			chai.request(app)
				.post('/api/v1/articles/')
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.article2)
				.end((_err, res) => {
					articleId = res.body.data.id;
					done();
				});
		});
		afterEach('delete an article', (done) => {
			chai.request(app)
				.delete(`/api/v1/articles/${articleId}`)
				.set('Authorization', `Bearer ${token}`)
				.end((_err, res) => {
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
					res.body.should.have.property('message').eql('All articles');
					res.body.should.have.property('data');
					res.body.data.should.have.property('articles');
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

		it('Employee can flag an article', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/flags`)
				.set('Authorization', `Bearer ${tokenTwo}`)
				.send(mockData.flag)
				.end((_err, res) => {
					res.should.have.status(201);
					res.body.should.have.property('status').eql(201);
					res.body.should.have.property('message').eql('Article flagged!');
					res.body.should.have.property('data');
					res.body.data.should.have.property('article');
					res.body.data.should.have.property('flag');
					res.body.data.flag.should.have.property('id');
					res.body.data.flag.should.have.property('reason').eql('inappropriate');
					res.body.data.flag.should.have.property('flaggedBy');
					res.body.data.flag.should.have.property('flaggedOn');
					done();
				});
		});

		it('Employee cannot flag an article if the reason is too short', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/flags`)
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.shortFlag)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('That reason may not be understandable, Care to elaborate?');
					done();
				});
		});

		it('Employee cannot flag an non-existing article', (done) => {
			chai.request(app)
				.post('/api/v1/articles/100/flags')
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.flag)
				.end((_err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('status').eql(404);
					res.body.should.have.property('error').eql('Article not found');
					done();
				});
		});

		it('Employee cannot flag an article with empty reason', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/flags`)
				.set('Authorization', `Bearer ${token}`)
				.send({reason: ''})
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('Can\'t flag article, no reason provided');
					done();
				});
		});

		it('Employee cannot flag an article with no reason', (done) => {
			const data = {};
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/flags`)
				.set('Authorization', `Bearer ${token}`)
				.send(data)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('Can\'t flag article, no reason provided');
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
	});

	describe('Consecutive same comments', () => {
		it('create an article', (done) => {
			chai.request(app)
				.post('/api/v1/articles/')
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.article2)
				.end((_err, res) => {
					articleId = res.body.data.id;
					res.should.have.status(201);
					res.body.should.have.property('status').eql(201);
					done();
				});
		});

		it('Employee can comment on an article', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/comments`)
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.comment)
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
		it('Employee cannot comment post the same comment on an article two consecutive times', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/comments`)
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.comment)
				.end((_err, res) => {
					res.should.have.status(409);
					res.should.have.property('body');
					res.body.should.be.a('object');
					res.body.should.have.property('status').eql(409);
					res.body.should.have.property('error').eql('Comment already exists');
					done();
				});
		});
		it('delete an article', (done) => {
			chai.request(app)
				.delete(`/api/v1/articles/${articleId}`)
				.set('Authorization', `Bearer ${token}`)
				.end((_err, res) => {
					done();
				});
		});
	});
	// Employee can edit, delete and update his articles

	describe('Employee can change his articles', () => {
		beforeEach('create an article', (done) => {
			chai.request(app)
				.post('/api/v1/articles/')
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.article2)
				.end((_err, res) => {
					articleId = res.body.data.id;
					res.should.have.status(201);
					res.body.should.have.property('status').eql(201);
					done();
				});
		});
		afterEach('delete an article', (done) => {
			chai.request(app)
				.delete(`/api/v1/articles/${articleId}`)
				.set('Authorization', `Bearer ${token}`)
				.end((_err, _res) => {
					done();
				});
		});
		it('Employee cannot edit a non existing article', (done) => {
			chai.request(app)
				.patch('/api/v1/articles/100')
				.send(mockData.editedArticle)
				.set('Authorization', `Bearer ${token}`)
				.end((_err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('status').eql(404);
					res.body.should.have.property('error').eql('Article not found');
					done();
				});
		});

		it('Employee cannot edit an article if no article or title is provided', (done) => {
			chai.request(app)
				.patch(`/api/v1/articles/${articleId}`)
				.send({})
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
					res.body.should.have.property('message').eql('Article successfully deleted');
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
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/comments`)
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.comment)
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
			chai.request(app)
				.post('/api/v1/articles/100/comments')
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.comment)
				.end((_err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('status').eql(404);
					res.body.should.have.property('error').eql('Article not found');
					done();
				});
		});

		it('Employee cannot comment on an article if no comment is provided', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/comments`)
				.set('Authorization', `Bearer ${token}`)
				.send({})
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


		it('Admin should log in', (done) => {
			chai.request(app)
				.post('/api/v1/auth/signin')
				.send(mockData.loginComplete)
				.end((_err, res) => {
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
			chai.request(app)
				.patch(`/api/v1/articles/${articleId}`)
				.send(mockData.editedArticle2)
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

		it('Admin cannot delete an unflagged article', (done) => {
			chai.request(app)
				.delete(`/api/v1/articles/${articleId}`)
				.set('Authorization', `Bearer ${adminToken}`)
				.end((_err, res) => {
					res.should.have.status(403);
					res.body.should.have.property('status').eql(403);
					res.body.should.have.property('error').eql('Cannot delete an unflagged article');
					done();
				});
		});

		it('Admin cannot delete a non-existing article', (done) => {
			chai.request(app)
				.delete('/api/v1/articles/100')
				.set('Authorization', `Bearer ${adminToken}`)
				.end((_err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('status').eql(404);
					res.body.should.have.property('error').eql('Article not found');
					done();
				});
		});
	});
	describe('Admin can delete a flagged article', () => {
		it('create an article', (done) => {
			chai.request(app)
				.post('/api/v1/articles/')
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.article2)
				.end((_err, res) => {
					articleId = res.body.data.id;
					res.should.have.status(201);
					res.body.should.have.property('status').eql(201);
					done();
				});
		});
		it('Employee cannot flag their own article', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/flags`)
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.flag)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('You cannot flag your own article');
					done();
				});
		});
		it('flag an article', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/flags`)
				.set('Authorization', `Bearer ${tokenTwo}`)
				.send(mockData.flag)
				.end((_err, _res) => {
					done();
				});
		});
		it('Admin can delete a flagged article', (done) => {
			chai.request(app)
				.delete(`/api/v1/articles/${articleId}`)
				.set('Authorization', `Bearer ${adminToken}`)
				.end((_err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('status').eql(200);
					res.body.should.have.property('message').eql('Article successfully deleted');
					done();
				});
		});
	});

	describe('Comments', () => {
		beforeEach('create an article', (done) => {
			chai.request(app)
				.post('/api/v1/articles/')
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.article3)
				.end((_err, res) => {
					articleId = res.body.data.id;
					done();
				});
		});

		beforeEach('Comment on an article', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/comments`)
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.comment2)
				.end((_err, res) => {
					commentId = res.body.data.comment.id;
					done();
				});
		});
		afterEach('Delete a comment', (done) => {
			chai.request(app)
				.delete(`/api/v1/articles/${articleId}/comments/${commentId}`)
				.set('Authorization', `Bearer ${token}`)
				.end((_err, _res) => {
					done();
				});
		});

		afterEach('delete an article', (done) => {
			chai.request(app)
				.delete(`/api/v1/articles/${articleId}`)
				.set('Authorization', `Bearer ${token}`)
				.end((_err, _res) => {
					done();
				});
		});
		it('Employee can flag a comment', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/comments/${commentId}`)
				.set('Authorization', `Bearer ${tokenTwo}`)
				.send(mockData.flag)
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

		it('Employee cannot flag a comment if the reason is too short', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/comments/${commentId}`)
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.shortFlag)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('That reason may not be understandable, Care to elaborate?');
					done();
				});
		});

		it('Employee cannot flag an non-existing comment', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/comments/100`)
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.flag)
				.end((_err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('status').eql(404);
					res.body.should.have.property('error').eql('Comment not found');
					done();
				});
		});

		it('Employee cannot flag a comment if the article doesn\'t exist', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/100/comments/${commentId}`)
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.flag)
				.end((_err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('status').eql(404);
					res.body.should.have.property('error').eql('Article not found');
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
					res.body.should.have.property('message').eql('Comment successfully deleted');
					done();
				});
		});
	});
	describe('Deleting flagged comments', () => {
		beforeEach('create an article', (done) => {
			chai.request(app)
				.post('/api/v1/articles/')
				.set('Authorization', `Bearer ${tokenTwo}`)
				.send(mockData.article4)
				.end((_err, res) => {
					articleId = res.body.data.id;
					done();
				});
		});
		beforeEach('Comment on an article', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/comments`)
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.comment)
				.end((_err, res) => {
					commentId = res.body.data.comment.id;
					done();
				});
		});
		beforeEach('Flag a comment', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/comments/${commentId}`)
				.set('Authorization', `Bearer ${tokenTwo}`)
				.send(mockData.flag)
				.end((err, _res) => {
					if (err) done(err);
					done();
				});
		});
		afterEach('delete a comment', (done) => {
			chai.request(app)
				.delete(`/api/v1/articles/${articleId}/comments/${commentId}`)
				.set('Authorization', `Bearer ${token}`)
				.end((_err, _res) => {
					done();
				});
		});
		afterEach('delete an article', (done) => {
			chai.request(app)
				.delete(`/api/v1/articles/${articleId}`)
				.set('Authorization', `Bearer ${tokenTwo}`)
				.end((err, _res) => {
					if (err) done(err);
					done();
				});
		});

		it('Employee cannot delete a comment even if it is flagged', (done) => {
			chai.request(app)
				.delete(`/api/v1/articles/${articleId}/comments/${commentId}`)
				.set('Authorization', `Bearer ${token}`)
				.end((_err, res) => {
					res.should.have.status(403);
					res.body.should.have.property('status').eql(403);
					res.body.should.have.property('error').eql('Not Authorized');
					done();
				});
		});
		it('Employee cannot flag their own comment', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/comments/${commentId}`)
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.flag)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('You cannot flag your own comment');
					done();
				});
		});
	});

	describe('Viewing flagged articles', () => {
		it('Admin cannot view flagged articles when none are flagged', (done) => {
			chai.request(app)
				.get('/api/v1/articles/flagged')
				.set('Authorization', `Bearer ${adminToken}`)
				.end((_err, res) => {
					res.should.have.status(404);
					res.should.have.property('body');
					res.body.should.have.property('status').eql(404);
					res.body.should.have.property('message').eql('No flagged articles');
					done();
				});
		});
		it('create an article', (done) => {
			chai.request(app)
				.post('/api/v1/articles')
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.article4)
				.end((err, res) => {
					articleId = res.body.data.id;
					if (err) done(err);
					done();
				});
		});
		it('flag an article', (done) => {
			chai.request(app)
				.post(`/api/v1/articles/${articleId}/flags`)
				.set('Authorization', `Bearer ${tokenTwo}`)
				.send(mockData.flag)
				.end((err, _res) => {
					if (err) done(err);
					done();
				});
		});
		it('Admin can view all flagged articles', (done) => {
			chai.request(app)
				.get('/api/v1/articles/flagged')
				.set('Authorization', `Bearer ${adminToken}`)
				.end((_err, res) => {
					res.should.have.status(200);
					res.should.have.property('body');
					res.body.should.have.property('status').eql(200);
					res.body.should.have.property('message').eql('Flagged articles');
					res.body.should.have.property('data');
					res.body.data.should.have.property('flaggedArticles');

					done();
				});
		});
		it('Non-admin cannot view flagged articles', (done) => {
			chai.request(app)
				.get('/api/v1/articles/flagged')
				.set('Authorization', `Bearer ${token}`)
				.end((_err, res) => {
					res.should.have.status(403);
					res.should.have.property('body');
					res.body.should.have.property('status').eql(403);
					res.body.should.have.property('error').eql('Not Authorized');
					done();
				});
		});
	});
});
describe('Version two', () => {
	it('first sign up an employee', (done) => {
		chai.request(app)
			.post('/api/v2/auth/signup')
			.send(mockData.baraka)
			.end((_err, res) => {
				token = res.body.data.token;
				done();
			});
	});

	it('first sign up another employee', (done) => {
		chai.request(app)
			.post('/api/v2/auth/signup')
			.send(mockData.james)
			.end((_err, res) => {
				tokenTwo = res.body.data.token;
				done();
			});
	});
	it('Employee should view all articles', (done) => {
		chai.request(app)
			.get('/api/v2/articles/')
			.set('Authorization', `Bearer ${token}`)
			.end((_err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('status').eql(200);
				res.body.should.have.property('message').eql('All articles');
				res.body.should.have.property('data');
				res.body.data.should.have.property('articles');
				done();
			});
	});
	it('Employee should not be able to view all articles if he/she is not signed up', (done) => {
		chai.request(app)
			.get('/api/v2/articles/')
			.end((_err, res) => {
				res.should.have.status(401);
				res.body.should.have.property('status').eql(401);
				res.body.should.have.property('error').eql('Please log in or sign up first');
				done();
			});
	});

	it('Employee should create an article', (done) => {
		chai.request(app)
			.post('/api/v2/articles/')
			.set('Authorization', `Bearer ${token}`)
			.send(mockData.article)
			.end((_err, res) => {
				articleId = res.body.data.id;
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
	it('Employee should not create an article with an invalid token', (done) => {
		chai.request(app)
			.post('/api/v2/articles/')
			.set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTMwMGViODQwIiwiZW1haWwiOiJrYWxpc2FAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoiQ2hyaXN0aWFuIiwibGFzdE5hbWUiOiJLYWxpc2EiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTY5MzI4MjY5fQ.Rzbk2yB0hM-vUV5OokmiIHT7IrTIPDuFXE3VYekDeo0')
			.send(mockData.article)
			.end((_err, res) => {
				res.should.have.status(401);
				res.body.should.have.property('status').eql(401);
				res.body.should.have.property('error').eql('Invalid token');
				done();
			});
	});

	it('Employee should not create an article if title is too short', (done) => {
		chai.request(app)
			.post('/api/v2/articles/')
			.set('Authorization', `Bearer ${token}`)
			.send(mockData.shortTitle)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('title length must be at least 5 characters long');

				done();
			});
	});

	it('Employee should be able to view a single article', (done) => {
		chai.request(app)
			.get(`/api/v2/articles/${articleId}`)
			.set('Authorization', `Bearer ${token}`)
			.end((_err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('status').eql(200);
				res.body.should.have.property('message').eql('Success');
				res.body.should.have.property('data');
				res.body.data.should.have.property('Article');
				done();
			});
	});

	it('Employee should not be able to view a non-existing article', (done) => {
		chai.request(app)
			.get('/api/v2/articles/1000')
			.set('Authorization', `Bearer ${token}`)
			.end((_err, res) => {
				res.should.have.status(404);
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('Article not found');
				done();
			});
	});
	it('Employee can flag an article', (done) => {
		chai.request(app)
			.post(`/api/v2/articles/${articleId}/flags`)
			.set('Authorization', `Bearer ${tokenTwo}`)
			.send(mockData.flag)
			.end((_err, res) => {
				res.should.have.status(201);
				res.body.should.have.property('status').eql(201);
				res.body.should.have.property('message').eql('Article flagged!');
				res.body.should.have.property('data');
				res.body.data.should.have.property('article');
				res.body.data.should.have.property('flag');
				res.body.data.flag.should.have.property('id');
				res.body.data.flag.should.have.property('reason').eql('inappropriate');
				res.body.data.flag.should.have.property('flaggedOn');
				done();
			});
	});

	it('Employee cannot flag an article if the reason is too short', (done) => {
		chai.request(app)
			.post(`/api/v2/articles/${articleId}/flags`)
			.set('Authorization', `Bearer ${token}`)
			.send(mockData.shortFlag)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('That reason may not be understandable, Care to elaborate?');
				done();
			});
	});

	it('Employee cannot flag an non-existing article', (done) => {
		chai.request(app)
			.post('/api/v2/articles/100/flags')
			.set('Authorization', `Bearer ${token}`)
			.send(mockData.flag)
			.end((_err, res) => {
				res.should.have.status(404);
				res.body.should.have.property('status').eql(404);
				res.body.should.have.property('error').eql('Article not found');
				done();
			});
	});

	it('Employee cannot flag an article with no reason', (done) => {
		const data = {};
		chai.request(app)
			.post(`/api/v2/articles/${articleId}/flags`)
			.set('Authorization', `Bearer ${token}`)
			.send(data)
			.end((_err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('status').eql(400);
				res.body.should.have.property('error').eql('Can\'t flag article, no reason provided');
				done();
			});
	});

	describe('Altering articles', () => {
		describe('Employee can change his articles', () => {
			beforeEach('create an article', (done) => {
				chai.request(app)
					.post('/api/v2/articles/')
					.set('Authorization', `Bearer ${token}`)
					.send(mockData.article2)
					.end((_err, res) => {
						articleId = res.body.data.id;
						done();
					});
			});
			afterEach('delete an article', (done) => {
				chai.request(app)
					.delete(`/api/v2/articles/${articleId}`)
					.set('Authorization', `Bearer ${token}`)
					.end((_err, _res) => {
						done();
					});
			});
			it('Employee can edit an article', (done) => {
				chai.request(app)
					.patch(`/api/v2/articles/${articleId}`)
					.set('Authorization', `Bearer ${token}`)
					.send(mockData.editedArticle)
					.end((_err, res) => {
						res.should.have.status(200);
						res.body.should.have.property('status').eql(200);
						res.body.should.have.property('message').eql('Article successfully edited');
						res.body.should.have.property('data');
						res.body.data.should.have.property('article');
						res.body.data.article.should.have.property('title').eql('This sign has just been edited');
						res.body.data.article.should.have.property('article').eql('Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?');
						done();
					});
			});

			it('Employee cannot edit a non existing article', (done) => {
				chai.request(app)
					.patch('/api/v2/articles/14400')
					.send(mockData.editedArticle)
					.set('Authorization', `Bearer ${token}`)
					.end((_err, res) => {
						res.should.have.status(404);
						res.body.should.have.property('status').eql(404);
						res.body.should.have.property('error').eql('Article not found');
						done();
					});
			});

			it('Employee cannot edit an article if no article or title is provided', (done) => {
				chai.request(app)
					.patch(`/api/v2/articles/${articleId}`)
					.send({})
					.set('Authorization', `Bearer ${token}`)
					.end((_err, res) => {
						res.should.have.status(400);
						res.body.should.have.property('status').eql(400);
						res.body.should.have.property('error').eql('Can\'t update if no changes made');
						done();
					});
			});
		});
	});

	describe('Consecutive same comments', () => {
		it('create an article', (done) => {
			chai.request(app)
				.post('/api/v2/articles/')
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.article2)
				.end((_err, res) => {
					articleId = res.body.data.id;
					res.should.have.status(201);
					res.body.should.have.property('status').eql(201);
					done();
				});
		});

		it('Employee can delete an article', (done) => {
			chai.request(app)
				.delete(`/api/v2/articles/${articleId}`)
				.set('Authorization', `Bearer ${token}`)
				.end((_err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('status').eql(200);
					res.body.should.have.property('message').eql('Article successfully deleted');
					done();
				});
		});
		it('create an article', (done) => {
			chai.request(app)
				.post('/api/v2/articles/')
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.article2)
				.end((_err, res) => {
					articleId = res.body.data.id;
					res.should.have.status(201);
					res.body.should.have.property('status').eql(201);
					done();
				});
		});

		it('Employee cannot delete a non-existent article', (done) => {
			chai.request(app)
				.delete('/api/v2/articles/100')
				.set('Authorization', `Bearer ${token}`)
				.end((_err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('status').eql(404);
					res.body.should.have.property('error').eql('Article not found');
					done();
				});
		});
		it('Employee can comment on an article', (done) => {
			chai.request(app)
				.post(`/api/v2/articles/${articleId}/comments`)
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.comment)
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
			chai.request(app)
				.post('/api/v2/articles/100/comments')
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.comment)
				.end((_err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('status').eql(404);
					res.body.should.have.property('error').eql('Article not found');
					done();
				});
		});

		it('Employee cannot comment on an article if no comment is provided', (done) => {
			chai.request(app)
				.post(`/api/v2/articles/${articleId}/comments`)
				.set('Authorization', `Bearer ${token}`)
				.send({})
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('You didn\'t write anything');
					done();
				});
		});

		it('Employee cannot comment on an article if the comment is empty', (done) => {
			const data = {
				comment: '  '
			};
			chai.request(app)
				.post(`/api/v2/articles/${articleId}/comments`)
				.set('Authorization', `Bearer ${token}`)
				.send(data)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('comment is not allowed to be empty');
					done();
				});
		});
		it('delete an article', (done) => {
			chai.request(app)
				.delete(`/api/v2/articles/${articleId}`)
				.set('Authorization', `Bearer ${token}`)
				.end((_err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('status').eql(200);
					done();
				});
		});
	});

	describe('Comments', () => {
		beforeEach('create an article', (done) => {
			chai.request(app)
				.post('/api/v2/articles/')
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.article3)
				.end((_err, res) => {
					articleId = res.body.data.id;
					done();
				});
		});

		beforeEach('Comment on an article', (done) => {
			chai.request(app)
				.post(`/api/v2/articles/${articleId}/comments`)
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.comment2)
				.end((_err, res) => {
					commentId = res.body.data.comment.id;
					done();
				});
		});
		afterEach('Delete a comment', (done) => {
			chai.request(app)
				.delete(`/api/v2/articles/${articleId}/comments/${commentId}`)
				.set('Authorization', `Bearer ${token}`)
				.end((_err, _res) => {
					done();
				});
		});

		afterEach('delete an article', (done) => {
			chai.request(app)
				.delete(`/api/v2/articles/${articleId}`)
				.set('Authorization', `Bearer ${token}`)
				.end((_err, _res) => {
					done();
				});
		});
		it('Employee can flag a comment', (done) => {
			chai.request(app)
				.post(`/api/v2/articles/${articleId}/comments/${commentId}`)
				.set('Authorization', `Bearer ${tokenTwo}`)
				.send(mockData.flag)
				.end((_err, res) => {
					res.should.have.status(201);
					res.body.should.have.property('status').eql(201);
					res.body.should.have.property('message').eql('Comment flagged!');
					res.body.should.have.property('data');
					res.body.data.should.have.property('comment');
					res.body.data.should.have.property('flag');
					res.body.data.flag.should.have.property('id');
					res.body.data.flag.should.have.property('reason').eql('inappropriate');
					res.body.data.flag.should.have.property('flaggedOn');
					done();
				});
		});

		it('Employee cannot flag a comment if the reason is too short', (done) => {
			chai.request(app)
				.post(`/api/v2/articles/${articleId}/comments/${commentId}`)
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.shortFlag)
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('That reason may not be understandable, Care to elaborate?');
					done();
				});
		});

		it('Employee cannot flag an non-existing comment', (done) => {
			chai.request(app)
				.post(`/api/v2/articles/${articleId}/comments/100`)
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.flag)
				.end((_err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('status').eql(404);
					res.body.should.have.property('error').eql('Comment not found');
					done();
				});
		});

		it('Employee cannot flag a comment if the article doesn\'t exist', (done) => {
			chai.request(app)
				.post(`/api/v2/articles/100/comments/${commentId}`)
				.set('Authorization', `Bearer ${token}`)
				.send(mockData.flag)
				.end((_err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('status').eql(404);
					res.body.should.have.property('error').eql('Article not found');
					done();
				});
		});

		it('Employee cannot flag a comment with no reason', (done) => {
			chai.request(app)
				.post(`/api/v2/articles/${articleId}/comments/${commentId}`)
				.set('Authorization', `Bearer ${token}`)
				.send({})
				.end((_err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('error').eql('Can\'t flag comment, no reason provided');
					done();
				});
		});
	});
});
