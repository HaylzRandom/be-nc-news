const {
  selectArticleById,
  getAllArticles,
} = require('../models/articles.model');
const { getAllCommentsForArticle } = require('../models/comments.model');

exports.getArticles = (req, res, next) => {
  const { order } = req.query;

  getAllArticles(order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params;

  getAllCommentsForArticle(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
