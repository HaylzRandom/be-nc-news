const {
  selectArticleById,
  getAllArticles,
  updateArticleById,
  addArticle,
} = require('../models/articles.model');
const { getAllCommentsForArticle } = require('../models/comments.model');

exports.getArticles = (req, res, next) => {
  const { sort_by, topic, order, limit, p } = req.query;

  getAllArticles(sort_by, topic, order, limit, p)
    .then((response) => {
      const articles = response[0];
      const count = response[1].rows[0];

      res.status(200).send({ articles, count });
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

exports.updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const update = req.body;

  updateArticleById(article_id, update)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.createArticle = (req, res, next) => {
  const newArticle = req.body;
  addArticle(newArticle)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
