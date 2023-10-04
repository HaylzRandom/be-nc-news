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
} = require('./controllers/articles.controller');
const {
  addCommentForArticle,
  getCommentsForArticle,
} = require('./controllers/comments.controller');
const { getUsers } = require('./controllers/users.controller');

const app = express();

app.use(express.json());

// /api
app.get('/api', getEndpoints);

// /api/articles
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsForArticle);
app.post('/api/articles/:article_id/comments', addCommentForArticle);

// /api/topics
app.get('/api/topics', getTopics);

// /api/users
app.get('/api/users', getUsers);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Path Not Found' });
});

// Error Handling
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);

module.exports = app;
