const db = require('../db/connection');

const { checkExists } = require('../db/seeds/utils');

exports.getAllUsers = () => {
  return db.query('SELECT * FROM users;').then(({ rows }) => {
    return rows;
  });
};

exports.getUserByUsername = (username) => {
  const query = 'SELECT * FROM users WHERE username = $1;';

  return checkExists('users', 'username', username)
    .then(() => {
      return db.query(query, [username]);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
