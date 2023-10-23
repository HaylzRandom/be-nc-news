const express = require('express');
const cors = require('cors');

// Error Handling
const {
  handleCustomErrors,
  handlePSQLErrors,
  handleServerErrors,
} = require('./middleware/errorHandler');

const apiRouter = require('./routes/api.routes');

const app = express();

app.use(cors());

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
