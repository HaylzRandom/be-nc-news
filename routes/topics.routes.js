const { getTopics, addTopic } = require('../controllers/topics.controller');

const topicsRouter = require('express').Router();

topicsRouter.route('/').get(getTopics).post(addTopic);

module.exports = topicsRouter;
