import jwt from 'jsonwebtoken';
import prisma from '../config/prismaClient.js';
import AppError from '../utils/appError.js';

/**
 * Middleware bảo vệ route: yêu cầu đăng nhập hợp lệ.
 * Chặn tài khoản bị ban (isBanned = true).
 */
export const protect = async (req, res, next) => {
  try {
    let token;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Bạn chưa đăng nhập. Vui lòng đăng nhập để truy cập.', 401, 'UNAUTHORIZED'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_tarot');

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      return next(new AppError('Người dùng thuộc token này không còn tồn tại.', 401, 'UNAUTHORIZED'));
    }

    // Chặn tài khoản bị ban
    if (currentUser.isBanned) {
      return next(new AppError('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.', 403, 'BANNED_USER'));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    next(new AppError('Token không hợp lệ hoặc đã hết hạn.', 401, 'UNAUTHORIZED'));
  }
};

/**
 * Middleware tùy chọn: nếu có token hợp lệ thì gán req.user, không thì bỏ qua.
 */
export const optionalProtect = async (req, res, next) => {
  try {
    let token;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_tarot');

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (currentUser && !currentUser.isBanned) {
      req.user = currentUser;
    }
    
    next();
  } catch (error) {
    // Token không hợp lệ hoặc user không tồn tại → tiếp tục như guest
    next();
  }
};
