const {
  addComment,
  getAllCommentsForArticle,
  deleteCommentById,
  updateCommentbyId,
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

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.updateComment = (req, res, next) => {
  const { comment_id } = req.params;
  const update = req.body;

  updateCommentbyId(comment_id, update)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
