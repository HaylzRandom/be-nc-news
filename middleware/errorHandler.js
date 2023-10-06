exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  switch (err.code) {
    case '22P02':
    case '23502':
      res.status(400).send({ msg: 'Bad Request' });
      break;
    case '23505':
      res.status(409).send({ msg: 'Topic already exists' });
      break;
    default:
      next(err);
      break;
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.error(err);

  res.status(500).send({ msg: 'Internal Server Error' });
};
