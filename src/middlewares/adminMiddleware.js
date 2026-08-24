import AppError from '../utils/appError.js';

/**
 * Middleware yêu cầu quyền ADMIN.
 * Phải được dùng sau middleware `protect`.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(new AppError('Bạn không có quyền thực hiện thao tác này.', 403, 'FORBIDDEN'));
  }
  next();
};
