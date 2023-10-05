const {
  getArticles,
  getArticleById,
  updateArticle,
} = require('../controllers/articles.controller');
const {
  getCommentsForArticle,
  addCommentForArticle,
} = require('../controllers/comments.controller');

const articlesRouter = require('express').Router();

articlesRouter.get('/', getArticles);

articlesRouter.get('/:article_id', getArticleById);

articlesRouter.get('/:article_id/comments', getCommentsForArticle);

articlesRouter.post('/:article_id/comments', addCommentForArticle);

articlesRouter.patch('/:article_id', updateArticle);

module.exports = articlesRouter;
