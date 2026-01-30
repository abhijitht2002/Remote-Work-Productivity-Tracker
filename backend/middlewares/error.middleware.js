export const errorHandler = (err, req, res, next) => {
  console.log(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "server error";

  // mongoose bad objectID
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // jwt error
  if (err.name === "JSONWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token Expired";
  }

  res.status(statusCode).json({ message });
};
