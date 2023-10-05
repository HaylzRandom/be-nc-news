const express = require('express');

// Error Handling
const {
  handleCustomErrors,
  handlePSQLErrors,
  handleServerErrors,
} = require('./errors');

// Controllers
const { getTopics } = require('./controllers/topics.controller');
const { getEndpoints } = require('./controllers/api.controller');
const {
  getArticleById,
  getArticles,
  updateArticle,
} = require('./controllers/articles.controller');
const {
  addCommentForArticle,
  getCommentsForArticle,
  deleteComment,
} = require('./controllers/comments.controller');
const { getUsers } = require('./controllers/users.controller');

const apiRouter = require('./routes/api.router');
const articlesRouter = require('./routes/articles.router');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Path Not Found' });
});

// Error Handling
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);

module.exports = app;
