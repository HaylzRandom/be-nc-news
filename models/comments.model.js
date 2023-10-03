const db = require('../db/connection');
const { checkExists } = require('../db/seeds/utils');

exports.getAllCommentsForArticle = (article_id) => {
  const query = `
    SELECT * FROM comments 
    WHERE article_id = $1
    ORDER BY created_at DESC;`;

  return db.query(query, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return checkExists('articles', 'article_id', article_id).then(() => {
        return Promise.reject({
          status: 404,
          msg: 'No comments found for article',
        });
      });
    } else {
      return rows;
    }
  });
};
