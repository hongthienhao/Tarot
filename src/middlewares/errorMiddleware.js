import AppError from '../utils/appError.js';

/**
 * Gửi lỗi chi tiết trong môi trường development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    code: err.code,
    message: err.message,
    status: err.status,
    error: err,
    stack: err.stack,
  });
};

/**
 * Gửi lỗi theo API Error Contract trong production: { code, message }
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });
  }
  // Programming or other unknown error: don't leak error details
  else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: 'Hệ thống gặp sự cố. Vui lòng thử lại sau.',
    });
  }
};

/**
 * Handle Prisma unique constraint violations
 */
const handlePrismaUniqueConstraint = (err) => {
  const field = err.meta?.target?.[0] || 'field';
  return new AppError(`Dữ liệu đã tồn tại: ${field}`, 400, 'DUPLICATE_ERROR');
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.code = err.code || 'INTERNAL_ERROR';

  // Handle Prisma errors
  if (err.code === 'P2002') {
    err = handlePrismaUniqueConstraint(err);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

export default globalErrorHandler;
