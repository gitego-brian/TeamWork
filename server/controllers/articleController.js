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
			message: 'Success',
			data: {
				articles: sortedArticles
			}
		});
	}

	newArticle(req, res) {
		const { title, article } = req.body;
		const { error } = schema.articleSchema.validate({
			title,
			article
		});
		if (error) {
			res.status(400).send({
				status: 400,
				error: error.details[0].message.replace(/[/"]/g, '')
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
					id,
					title,
					article,
					authorId,
					authorName
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
			if (req.payload.isAdmin || articleToUpdate.authorId === authorId) {
				if (!title && !article) {
					res.status(400).send({
						status: 400,
						error: "Can't update if no changes made"
					});
				} else {
					if (title) {
						articleToUpdate.title = title;
					}
					if (article) {
						articleToUpdate.article = article;
					}
					const updatedArticle = articleToUpdate;
					updatedArticle.updatedOn = Moment().format('YYYY-MMM-DD');
					res.status(200).send({
						status: 200,
						message: 'Article successfully edited',
						data: {
							updatedArticle
						}
					});
				}
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

	deleteArticle(req, res) {
		const authorId = req.payload.id;
		const article = Helper.findOne(req.params.articleID, articles);
		if (article) {
			if (article.authorId === authorId || req.payload.isAdmin) {
				articles.splice(articles.indexOf(article), 1);
				res.status(200).send({
					status: 200,
					message: 'Article successfully deleted',
					data: {
						article
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

	postComment(req, res) {
		const { comment } = req.body;
		const { error } = schema.commentSchema.validate({
			comment
		});
		if (error) {
			if (error.details[0].type === 'any.required') {
				res.status(400).send({
					status: 400,
					error: "You didn't write anything"
				});
			} else {
				res.status(400).send({
					status: 400,
					error: error.details[0].message.replace(/[/"]/g, '')
				});
			}
		} else {
			const authorId = req.payload.id;
			const article = Helper.findOne(req.params.articleID, articles);
			if (article) {
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
			} else {
				res.status(404).send({
					status: 404,
					error: 'Article not found'
				});
			}
		}
	}

	flagComment(req, res) {
		const { reason } = req.body;
		const { error } = schema.flagSchema.validate({
			reason
		});
		if (!reason) {
			res.status(400).send({
				status: 400,
				error: "Can't flag comment, no reason provided"
			});
		} else if (error) {
			if (error.details[0].type === 'string.min') {
				res.status(400).send({
					status: 400,
					error: 'That reason may not be understandable, Care to elaborate?'
				});
			} else if (error.details[0].type === 'any.required') {
				res.status(400).send({
					status: 400,
					error: "Can't flag comment, no reason provided"
				});
			}
		} else {
			const { firstName, lastName } = req.payload;
			const { commentID } = req.params;
			const article = Helper.findOne(req.params.articleID, articles);
			if (article) {
				const comment = Helper.findOne(commentID, article.comments);
				if (comment) {
					const flag = new Flag(req.body.reason, `${firstName} ${lastName}`);
					comment.flags.push(flag);
					res.status(201).send({
						status: 201,
						message: 'Comment flagged!',
						data: {
							flag,
							comment
						}
					});
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
		const { commentID } = req.params;
		const article = Helper.findOne(req.params.articleID, articles);
		if (article) {
			const comment = Helper.findOne(commentID, article.comments);
			if (comment) {
				const { id } = req.payload;
				if (
					(comment.flags.length && req.payload.isAdmin)
          || id === comment.authorId
				) {
					article.comments.splice(article.comments.indexOf(comment), 1);
					res.status(200).send({
						status: 200,
						message: 'Comment successfully deleted',
						data: {
							comment
						}
					});
				} else if (!comment.flags.length && req.payload.isAdmin) {
					res.status(403).send({
						status: 403,
						error: 'Cannot delete an unflagged comment'
					});
				} else if (comment.flags.length && !req.payload.isAdmin) {
					res.status(403).send({
						status: 403,
						error: 'Not Authorized'
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
