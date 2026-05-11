import jwt from 'jsonwebtoken';
import prisma from '../config/prismaClient.js';
import AppError from '../utils/appError.js';

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
      return next(new AppError('Bạn chưa đăng nhập. Vui lòng đăng nhập để truy cập.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_tarot');

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      return next(new AppError('Người dùng thuộc token này không còn tồn tại.', 401));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    next(new AppError('Token không hợp lệ hoặc đã hết hạn.', 401));
  }
};
