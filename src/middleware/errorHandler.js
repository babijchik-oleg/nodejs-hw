import { isHttpError } from 'http-errors';

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const status = isHttpError(err)
    ? err.status
    : err.status || err.statusCode || 500;

  const message = isHttpError(err) ? err.message : 'Something went wrong';

  res.status(status).json({
    message,
  });
};

export default errorHandler;
