exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  switch (err.code) {
    case '22P02':
      res.status(400).send({ msg: 'Bad Request' });
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
