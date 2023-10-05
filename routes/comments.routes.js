const {
  deleteComment,
  updateComment,
} = require('../controllers/comments.controller');

const commentsRouter = require('express').Router();

commentsRouter.route('/').get((req, res) => {
  // Future implementation of adding a get all comments query
  res.status(200).send('All okay from comments');
});

commentsRouter.route('/:comment_id').patch(updateComment).delete(deleteComment);

module.exports = commentsRouter;
