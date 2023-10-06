const db = require('../db/connection');
const { checkExists } = require('../db/seeds/utils');

exports.getAllArticles = (
  sort_by = 'created_at',
  topic,
  order = 'DESC',
  limit = 10,
  page = 1
) => {
  const topicRegex = /^\d+$/;
  const numberRegex = /\d+/;

  const validSortBy = {
    created_at: 'created_at',
    article_id: 'article_id',
    author: 'author',
    topic: 'topic',
  };

  const validSortOrder = {
    ASC: 'ASC',
    DESC: 'DESC',
    asc: 'ASC',
    desc: 'DESC',
  };

  if (
    !(sort_by in validSortBy) ||
    !(order in validSortOrder) ||
    topicRegex.test(topic) ||
    !numberRegex.test(limit) ||
    !numberRegex.test(page)
  ) {
    return Promise.reject({ status: 400, msg: 'Invalid Query Passed' });
  }

  let selectQuery = `
  SELECT a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id)::int as comment_count
  FROM articles a
  LEFT JOIN comments c
  ON a.article_id = c.article_id
  `;

  const values = [];

  if (topic) {
    selectQuery += `WHERE a.topic = $1`;
    values.push(topic);
  }

  selectQuery += `GROUP BY a.article_id
  ORDER BY a.${validSortBy[sort_by]} ${validSortOrder[order]}
  LIMIT ${limit}
  OFFSET ${(page - 1) * limit};`;

  const getArticles = db.query(selectQuery, values);
  const countArticles = db.query(
    'SELECT COUNT(article_id)::INT as total_count FROM articles;'
  );

  const promises = [getArticles, countArticles];

  return Promise.all(promises)
    .then(([articles, count]) => {
      return articles.rows.length === 0
        ? Promise.reject({ status: 404, msg: 'Topic does not exist' })
        : Promise.resolve([articles.rows, count]);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.selectArticleById = (article_id) => {
  const query = `
  SELECT a.*, COUNT(c.comment_id)::INT as comment_count 
  FROM articles a
  LEFT JOIN comments c
  ON a.article_id = c.article_id
  WHERE a.article_id = $1
  GROUP BY a.article_id;
  `;

  return db.query(query, [article_id]).then(({ rows }) => {
    return rows.length === 0
      ? Promise.reject({ status: 404, msg: 'Article does not exist' })
      : rows[0];
  });
};

exports.updateArticleById = (article_id, article) => {
  const { inc_votes } = article;

  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: 'Required information is missing',
    });
  }

  const query = `
  UPDATE articles
  SET
  votes = votes + $1
  WHERE 
  article_id = $2
  RETURNING *;
  `;

  return checkExists('articles', 'article_id', article_id)
    .then(() => {
      return db.query(query, [inc_votes, article_id]);
    })
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.addArticle = (article) => {
  const { author, title, body, topic, article_img_url } = article;

  if (!author || !title || !body || !topic) {
    return Promise.reject({
      status: 400,
      msg: 'Required information is missing',
    });
  }

  let query = ``;
  const values = [author, title, body, topic];

  if (!article_img_url) {
    query = `
  INSERT INTO articles
  (author, title, body, topic)
  VALUES
  ($1, $2, $3, $4)
  RETURNING *;
  `;
  } else {
    query = `
  INSERT INTO articles
  (author, title, body, topic, article_img_url)
  VALUES
  ($1, $2, $3, $4, $5)
  RETURNING *;
  `;
    values.push(article_img_url);
  }

  const promises = [
    checkExists('users', 'username', author),
    checkExists('topics', 'slug', topic),
  ];

  return Promise.all(promises)
    .then(() => {
      return db.query(query, values);
    })
    .then(({ rows }) => {
      return this.selectArticleById(rows[0].article_id);
    })
    .then((article) => {
      return article;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.deleteArticleById = (article_id) => {
  return checkExists('articles', 'article_id', article_id).then(() => {
    return db.query('DELETE FROM articles WHERE article_id = $1 RETURNING *;', [
      article_id,
    ]);
  });
};
