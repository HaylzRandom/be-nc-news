const { getEndpoints } = require('../controllers/api.controller');
const articlesRouter = require('./articles.routes');
const commentsRouter = require('./comments.routes');
const topicsRouter = require('./topics.routes');
const userRouter = require('./users.routes');

const apiRouter = require('express').Router();

apiRouter.route('/').get(getEndpoints);

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', userRouter);

module.exports = apiRouter;
