const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const { getEndpoints } = require('./controllers/api.controller');
const { getArticleById } = require('./controllers/articles.controller');

const app = express();

app.use(express.json());

// /api
app.get('/api', getEndpoints);

// /api/articles/:article_id
app.get('/api/articles/:article_id', getArticleById);

// /api/topics
app.get('/api/topics', getTopics);

// Error Handling
app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Path Not Found' });
});

app.use((err, req, res, next) => {
  //console.error(err); // Will remove once all endpoints are complete as I have a feeling I may need it for future!

  if (err.code) {
    switch (err.code) {
      case '22P02':
        res.status(400).send({ msg: 'Bad Request' });
        break;
      default:
        res.status(500).send({ msg: 'Internal Server Error' });
    }
  }

  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
