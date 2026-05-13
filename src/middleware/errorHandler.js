// Centralized Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  const isInvalidJsonError =
    err instanceof SyntaxError &&
    err.status === 400 &&
    err.type === "entity.parse.failed";

  const status = isInvalidJsonError ? 400 : err.status || 500;
  const message = isInvalidJsonError
    ? "Invalid JSON payload"
    : err.message || "Lỗi server nội bộ";

  console.error("🚀 ~ Error:", {
    message,
    status,
    path: req.path,
    method: req.method,
  });

  res.status(status).json({
    status: "ERR",
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
