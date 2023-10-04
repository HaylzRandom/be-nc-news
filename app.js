const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const { getEndpoints } = require('./controllers/api.controller');
const {
  getArticleById,
  getArticles,
  getCommentsForArticle,
} = require('./controllers/articles.controller');
const {
  handleCustomErrors,
  handlePSQLErrors,
  handleServerErrors,
} = require('./errors');

const app = express();

app.use(express.json());

// /api
app.get('/api', getEndpoints);

// /api/articles
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsForArticle);

// /api/topics
app.get('/api/topics', getTopics);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Path Not Found' });
});

// Error Handling
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);

module.exports = app;
