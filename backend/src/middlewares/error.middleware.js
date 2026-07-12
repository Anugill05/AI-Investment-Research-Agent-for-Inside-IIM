import { logger } from "../config/logger.js";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === "P2002") {
    statusCode = 409;
    message = "A record with this value already exists.";
  }
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found.";
  }
  if (err.name === "ZodError") {
    statusCode = 400;
    message = err.errors?.map((e) => e.message).join(", ") || "Validation error";
  }

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} -> ${message}\n${err.stack}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.details ? { details: err.details } : {}),
    ...(env.NODE_ENV === "development" && statusCode >= 500 ? { stack: err.stack } : {}),
  });
}

export default { notFoundHandler, errorHandler };
