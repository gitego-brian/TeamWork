/* eslint-disable no-throw-literal */
import Moment from 'moment';
import Article from '../models/articleModel';
import Comment from '../models/commentModel';
import Flag from '../models/flagModel';
import Helper from '../helpers/helper';
import { articles } from '../data/data';
import schema from '../helpers/joiValidation';

class ArticleController {
	getArticles(_req, res) {
		const sortedArticles = articles.sort(
			(a, b) => new Moment(b.createdOn).format('YYYYMMDD')
        - new Moment(a.createdOn).format('YYYYMMDD')
		);
		res.status(200).send({
			status: 200,
			message: 'All articles',
			data: {
				articles: sortedArticles
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
					message: 'No flagged articles',
				});
			} else {
				const sortedArticles = flaggedArticles.sort(
					(a, b) => new Moment(b.createdOn).format('YYYYMMDD')
			- new Moment(a.createdOn).format('YYYYMMDD')
				);
				res.status(200).send({
					status: 200,
					message: 'Flagged articles',
					data: {
						articles: sortedArticles
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
					authorId,
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
					if (!title && !article) throw 'Can\'t update if no changes made';
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
		try {
			if (!reason) throw 'Can\'t flag article, no reason provided';
			if (error) {
				if (error.details[0].type === 'string.min') throw 'That reason may not be understandable, Care to elaborate?';
				if (error.details[0].type === 'any.required') throw 'Can\'t flag article, no reason provided';
			}
		} catch (err) {
			res.status(400).send({
				status: 400,
				error: err
			});
			return;
		}
		const { firstName, lastName, id } = req.payload;
		const { articleID } = req.params;
		const article = Helper.findOne(articleID, articles);
		if (article) {
			if (id === article.authorId) {
				res.status(400).send({
					status: 400,
					error: 'You cannot flag your own article',
				});
			} else {
				const match = article.flags.find((el) => el.authorId === id);
				if (match) {
					res.status(409).send({
						status: 409,
						error: 'You have already flagged that article',
					});
				} else {
					const flag = new Flag(req.body.reason, `${firstName} ${lastName}`, id);
					article.flags.push(flag);
					res.status(201).send({
						status: 201,
						message: 'Article flagged!',
						data: {
							flag,
							article
						}
					});
				}
			}
		} else {
			res.status(404).send({
				status: 404,
				error: 'Article not found'
			});
		}
	}

	deleteArticle(req, res) {
		const { articleID } = req.params;
		const article = Helper.findOne(articleID, articles);
		if (article) {
			const { id } = req.payload;
			if ((article.flags.length && req.payload.isAdmin) || id === article.authorId) {
				articles.splice(articles.indexOf(article), 1);
				res.status(200).send({
					status: 200,
					message: 'Article successfully deleted',
				});
			} else {
				try {
					if (!article.flags.length && req.payload.isAdmin) throw 'Cannot delete an unflagged article';
					else throw 'Not Authorized';
				} catch (err) {
					res.status(403).send({
						status: 403,
						error: err
					});
				}
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
				if (error.details[0].type === 'any.required') throw 'You didn\'t write anything';
				else throw error.details[0].message.replace(/[/"]/g, '');
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
		try {
			if (!reason) throw 'Can\'t flag comment, no reason provided';
			if (error) {
				if (error.details[0].type === 'string.min') throw 'That reason may not be understandable, Care to elaborate?';
				if (error.details[0].type === 'any.required') throw 'Can\'t flag comment, no reason provided';
			}
		} catch (err) {
			res.status(400).send({
				status: 400,
				error: err
			});
			return;
		}

		const { firstName, lastName, id } = req.payload;
		const { commentID } = req.params;
		const article = Helper.findOne(req.params.articleID, articles);
		if (article) {
			const comment = Helper.findOne(commentID, article.comments);
			if (comment) {
				if (id === comment.authorId) {
					res.status(400).send({
						status: 400,
						error: 'You cannot flag your own comment',
					});
				} else {
					const match = comment.flags.find((el) => el.authorId === id);
					if (match) {
						res.status(409).send({
							status: 409,
							error: 'You have already flagged that comment',
						});
					} else {
						const flag = new Flag(req.body.reason, `${firstName} ${lastName}`, id);
						comment.flags.push(flag);
						res.status(201).send({
							status: 201,
							message: 'Comment flagged!',
							data: {
								flag,
								comment
							}
						});
					}
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

	deleteComment(req, res) {
		const { commentID } = req.params;
		const article = Helper.findOne(req.params.articleID, articles);
		if (article) {
			const comment = Helper.findOne(commentID, article.comments);
			if (comment) {
				const { id } = req.payload;
				if ((comment.flags.length && req.payload.isAdmin) || id === comment.authorId) {
					article.comments.splice(article.comments.indexOf(comment), 1);

					res.status(200).send({
						status: 200,
						message: 'Comment successfully deleted',
					});
				} else {
					try {
						if (!comment.flags.length && req.payload.isAdmin) throw 'Cannot delete an unflagged comment';
						else throw 'Not Authorized';
					} catch (err) {
						res.status(403).send({
							status: 403,
							error: err
						});
					}
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
