const { getAllEndpoints } = require('../models/api.model');

exports.getEndpoints = (req, res) => {
  getAllEndpoints().then((endpoints) => {
    res.status(200).send(endpoints);
  });
};
