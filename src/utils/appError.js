/**
 * Custom Error Class to handle operational errors.
 * Supports `code` field for API Error Contract: { code, message }
 */
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Distinguish operational errors from programming errors
    this.code = code || this._deriveCode(statusCode);

    Error.captureStackTrace(this, this.constructor);
  }

  _deriveCode(statusCode) {
    switch (statusCode) {
      case 400: return 'INVALID_REQUEST';
      case 401: return 'UNAUTHORIZED';
      case 403: return 'FORBIDDEN';
      case 404: return 'NOT_FOUND';
      default:  return 'INTERNAL_ERROR';
    }
  }
}

export default AppError;
