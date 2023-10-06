const db = require('../db/connection');

exports.getAllTopics = () => {
  return db.query('SELECT * FROM topics;').then(({ rows }) => {
    return rows;
  });
};

exports.createTopic = (topic) => {
  const { slug, description } = topic;

  if (!slug) {
    return Promise.reject({
      status: 400,
      msg: 'Required information is missing',
    });
  }

  let query = ``;

  const values = [slug];

  if (!description) {
    query = `
    INSERT INTO topics
    (slug)
    VALUES
    ($1)
    RETURNING *;
    `;
  } else {
    query = `
    INSERT INTO topics
    (slug, description)
    VALUES
    ($1, $2)
    RETURNING *;
    `;
    values.push(description);
  }
  return db
    .query(query, values)
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
