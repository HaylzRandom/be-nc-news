const { getAllTopics, createTopic } = require('../models/topics.model');

exports.getTopics = (req, res) => {
  getAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.addTopic = (req, res, next) => {
  const newTopic = req.body;
  createTopic(newTopic)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
