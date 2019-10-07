/* eslint-disable no-throw-literal */
import Moment from 'moment';
import Article from '../models/articleModel';
import Comment from '../models/commentModel';
import Helper from '../helpers/helper';
import { articles } from '../data/data';
import schema from '../helpers/joiValidation';

class ArticleController {
	getArticles(_req, res) {
		res.status(200).send({
			status: 200,
			message: 'All articles',
			data: {
				articles: Helper.sortArticles(articles)
			}
		});
	}

	getFlaggedArticles(req, res) {
		if (req.payload.isAdmin) {
			const flaggedArticles = [];
			articles.forEach((el) => {
				if (el.flags.length) {
					flaggedArticles.push(el);
				}
			});
			if (!flaggedArticles.length) {
				res.status(404).send({
					status: 404,
					message: 'No flagged articles'
				});
			} else {
				res.status(200).send({
					status: 200,
					message: 'Flagged articles',
					data: {
						flaggedArticles: Helper.sortArticles(flaggedArticles)
					}
				});
			}
		} else {
			res.status(403).send({
				status: 403,
				error: 'Not Authorized'
			});
		}
	}

	newArticle(req, res) {
		const { title, article } = req.body;
		const { error } = schema.articleSchema.validate({
			title,
			article
		});
		try {
			if (error) throw error.details[0].message.replace(/[/"]/g, '');
		} catch (err) {
			res.status(400).send({
				status: 400,
				error: err
			});
			return;
		}
		const match = articles.find((el) => el.title === req.body.title);
		if (match) {
			res.status(409).send({
				status: 409,
				error: 'Article already exists'
			});
		} else {
			const { firstName, lastName, id: authorId } = req.payload;
			const authorName = `${firstName} ${lastName}`;
			const newArticle = new Article(
				req.body.title,
				req.body.article,
				authorId,
				authorName
			);
			const { title, article, id } = newArticle;
			articles.push(newArticle);
			res.status(201).send({
				status: 201,
				message: 'Article successfully created',
				data: {
					title,
					authorName,
					article,
					id,
					authorId
				}
			});
		}
	}

	getSingleArticle(req, res) {
		const article = Helper.findOne(req.params.articleID, articles);
		if (article) {
			res.status(200).send({
				status: 200,
				message: 'Success',
				data: {
					article
				}
			});
		} else {
			res.status(404).send({
				status: 404,
				error: 'Article not found'
			});
		}
	}

	updateArticle(req, res) {
		const { title, article } = req.body;
		const authorId = req.payload.id;
		const articleToUpdate = Helper.findOne(req.params.articleID, articles);
		if (articleToUpdate) {
			if (articleToUpdate.authorId === authorId) {
				try {
					if (!title && !article) throw "Can't update if no changes made";
				} catch (err) {
					res.status(400).send({
						status: 400,
						error: err
					});
					return;
				}

				if (title) {
					articleToUpdate.title = title;
				}
				if (article) {
					articleToUpdate.article = article;
				}
				articleToUpdate.flags = [];
				const updatedArticle = articleToUpdate;
				updatedArticle.updatedOn = Moment().format('YYYY-MMM-DD');
				res.status(200).send({
					status: 200,
					message: 'Article successfully edited',
					data: {
						updatedArticle
					}
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
				error: 'Article not found'
			});
		}
	}

	shareArticle(req, res) {
		const article = Helper.findOne(req.params.articleID, articles);
		const { firstName, lastName } = req.payload;
		if (article) {
			article.sharedBy = `${firstName} ${lastName}`;
			res.status(201).send({
				status: 201,
				message: 'Article successfully shared',
				data: {
					article
				}
			});
		} else {
			res.status(404).send({
				status: 404,
				error: 'Article not found'
			});
		}
	}

	flagArticle(req, res) {
		const { reason } = req.body;
		const { error } = schema.flagSchema.validate({
			reason
		});
		const err = Helper.validateFlag(reason, error, 'article');
		if (err) {
			res.status(400).send({
				status: 400,
				error: err
			});
		} else {
			const { articleID } = req.params;
			const article = Helper.findOne(articleID, articles);
			if (article) {
				const respond = Helper.flagger(req.payload, article, reason);
				const {
 error, status, message, flag 
} = respond;
				if (error) {
					res.status(status).send({
						status,
						error: `${error} article`
					});
				} else {
					res.status(status).send({
						status,
						message: `Article ${message}`,
						data: {
							flag,
							article
						}
					});
				}
			} else {
				res.status(404).send({
					status: 404,
					error: 'Article not found'
				});
			}
		}
	}

	deleteArticle(req, res) {
		const { articleID } = req.params;
		const article = Helper.findOne(articleID, articles);
		if (article) {
			const response = Helper.deleteSth(
				req.payload,
				articles,
				article,
				'article'
			);
			if (response.status === 200) {
				res.status(response.status).send({
					status: response.status,
					message: `Article ${response.message}`
				});
			} else {
				res.status(403).send({
					status: response.status,
					error: response.message
				});
			}
		} else {
			res.status(404).send({
				status: 404,
				error: 'Article not found'
			});
		}
	}

	postComment(req, res) {
		const { comment } = req.body;
		const { error } = schema.commentSchema.validate({
			comment
		});
		try {
			if (error) {
				if (error.details[0].type === 'any.required') {
					throw "You didn't write anything";
				} else throw error.details[0].message.replace(/[/"]/g, '');
			}
		} catch (err) {
			res.status(400).send({
				status: 400,
				error: err
			});
			return;
		}
		const authorId = req.payload.id;
		const article = Helper.findOne(req.params.articleID, articles);
		if (article) {
			const match = article.comments.find(
				(el) => el.comment === req.body.comment
			);
			if (match) {
				res.status(409).send({
					status: 409,
					error: 'Comment already exists'
				});
			} else {
				const newComment = new Comment(req.body.comment, authorId);
				article.comments.push(newComment);
				res.status(201).send({
					status: 201,
					message: 'Comment posted successfully',
					data: {
						articleTitle: article.title,
						article: article.article,
						comment: newComment
					}
				});
			}
		} else {
			res.status(404).send({
				status: 404,
				error: 'Article not found'
			});
		}
	}

	flagComment(req, res) {
		const { reason } = req.body;
		const { error } = schema.flagSchema.validate({
			reason
		});
		const err = Helper.validateFlag(reason, error, 'comment');
		if (err) {
			res.status(400).send({
				status: 400,
				error: err
			});
		} else {
			const { commentID } = req.params;
			const article = Helper.findOne(req.params.articleID, articles);
			if (article) {
				const comment = Helper.findOne(commentID, article.comments);
				if (comment) {
					const response = Helper.flagger(req.payload, comment, reason);
					const {
 error, status, message, flag 
} = response;
					if (error) {
						res.status(status).send({
							status,
							error: `${error} comment`
						});
					} else {
						res.status(status).send({
							status,
							message: `Comment ${message}`,
							data: {
								flag,
								comment
							}
						});
					}
				} else {
					res.status(404).send({
						status: 404,
						error: 'Comment not found'
					});
				}
			} else {
				res.status(404).send({
					status: 404,
					error: 'Article not found'
				});
			}
		}
	}

	deleteComment(req, res) {
		const { commentID, articleID } = req.params;
		const article = Helper.findOne(articleID, articles);
		if (article) {
			const comment = Helper.findOne(commentID, article.comments);
			if (comment) {
				const response = Helper.deleteSth(
					req.payload,
					articles,
					article,
					'comment'
				);
				console.log(response);
				
				if (response.status === 200) {
					res.status(response.status).send({
						status: response.status,
						message: `Comment ${response.message}`
					});
				} else {
					res.status(403).send({
						status: response.status,
						error: response.message
					});
				}
			} else {
				res.status(404).send({
					status: 404,
					error: 'Comment not found'
				});
			}
		} else {
			res.status(404).send({
				status: 404,
				error: 'Article not found'
			});
		}
	}
}
export default new ArticleController();
