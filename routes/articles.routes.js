const {
  getArticles,
  getArticleById,
  updateArticle,
  createArticle,
  deleteArticle,
} = require('../controllers/articles.controller');
const {
  getCommentsForArticle,
  addCommentForArticle,
} = require('../controllers/comments.controller');

const articlesRouter = require('express').Router();

articlesRouter.route('/').get(getArticles).post(createArticle);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticle)
  .delete(deleteArticle);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsForArticle)
  .post(addCommentForArticle);

module.exports = articlesRouter;
