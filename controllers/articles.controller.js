const {
  selectArticleById,
  getAllArticles,
} = require('../models/articles.model');
const { getAllCommentsForArticle } = require('../models/comments.model');

exports.getArticles = (req, res, next) => {
  const { sort_by, order } = req.query;

  getAllArticles(sort_by, order)
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
