const db = require('../db/connection');

exports.getAllCommentsForArticle = (article_id) => {
  const query = `
    SELECT * FROM comments 
    WHERE article_id = $1
    ORDER BY created_at DESC;`;

  return db.query(query, [article_id]).then(({ rows }) => {
    return rows.length === 0
      ? Promise.reject({ status: 404, msg: 'No comments found for article' })
      : rows;
  });
};
