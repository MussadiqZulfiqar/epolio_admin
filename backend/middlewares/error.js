module.exports = (err, req, res, next) => {
  const error = err.message || "Error has occurred";
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error,
  });
};
