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
          status: 200,
          msg: 'No comments found for article',
        });
      });
    } else {
      return rows;
    }
  });
};

exports.addComment = (article_id, comment) => {
  const { username, body } = comment;

  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: 'Required information is missing',
    });
  }

  const query = `
    INSERT INTO comments
    (body, article_id, author)
    VALUES
    ($1, $2, $3)
    RETURNING *;
  `;

  const promises = [
    checkExists('articles', 'article_id', article_id),
    checkExists('users', 'username', username),
  ];

  return Promise.all(promises)
    .then(() => {
      return db.query(query, [body, article_id, username]).then(({ rows }) => {
        return rows[0];
      });
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.deleteCommentById = (comment_id) => {
  return checkExists('comments', 'comment_id', comment_id).then(() => {
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [
      comment_id,
    ]);
  });
};
