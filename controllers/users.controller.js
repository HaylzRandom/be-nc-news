const { getAllUsers } = require('../models/users.model');

exports.getUsers = (req, res) => {
  getAllUsers().then((users) => {
    res.status(200).send({ users });
  });
};
