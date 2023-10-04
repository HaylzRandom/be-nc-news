const {
  addComment,
  getAllCommentsForArticle,
} = require('../models/comments.model');

exports.getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params;

  getAllCommentsForArticle(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addCommentForArticle = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;

  addComment(article_id, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
