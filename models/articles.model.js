const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      //   if (result.rows.length === 0) {
      //     console.log('I made it!');
      //     const rejection = Promise.reject({
      //       status: 404,
      //       msg: 'Article does not exist',
      //     });
      //     console.log(rejection);
      //     return rejection;
      //   } else {
      //     return result.rows[0];
      //   }

      return rows.length === 0
        ? Promise.reject({ status: 404, msg: 'Article does not exist' })
        : rows[0];
    });
};
