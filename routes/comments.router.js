const { deleteComment } = require('../controllers/comments.controller');

const commentsRouter = require('express').Router();

commentsRouter.get('/', (req, res) => {
  res.status(200).send('All okay from comments');
});

commentsRouter.delete('/:comment_id', deleteComment);

module.exports = commentsRouter;
