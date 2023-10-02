const { getAllTopics } = require('../models/topics.models');

exports.getTopics = (req, res) => {
  getAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
