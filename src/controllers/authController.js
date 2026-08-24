import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../config/prismaClient.js';
import AppError from '../utils/appError.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_tarot', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

/**
 * Normalize email: lowercase + trim
 */
const normalizeEmail = (email) => email?.toLowerCase().trim();

export const googleLogin = async (req, res, next) => {
  try {
    // Chấp nhận cả 'credential' (Google One Tap) và 'token' (OAuth flow)
    const idToken = req.body.credential || req.body.token;

    if (!idToken) {
      return next(new AppError('Thiếu Google credential.', 400, 'INVALID_REQUEST'));
    }

    // Verify the Google ID Token
    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      return next(new AppError('Google token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.', 401, 'INVALID_GOOGLE_TOKEN'));
    }

    const { sub: googleId, email: rawEmail, name, picture } = payload;

    if (!rawEmail) {
      return next(new AppError('Không thể lấy email từ tài khoản Google.', 400, 'INVALID_REQUEST'));
    }

    const email = normalizeEmail(rawEmail);

    // Kiểm tra email trong Blacklist
    const blacklisted = await prisma.blacklist.findUnique({ where: { email } });
    if (blacklisted) {
      return next(new AppError('Email này đã bị cấm truy cập hệ thống.', 403, 'BLACKLISTED_EMAIL'));
    }

    // Xác định role: duy nhất honguyenthienhao@gmail.com là ADMIN
    const isAdmin = email === 'honguyenthienhao@gmail.com' || (ADMIN_EMAIL && email === normalizeEmail(ADMIN_EMAIL));

    // Find/Create User
    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email }] },
    });

    if (user) {
      // Nếu tài khoản bị ban
      if (user.isBanned) {
        return next(new AppError('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.', 403, 'BANNED_USER'));
      }

      // Cập nhật googleId, avatar, fullName nếu thiếu, và role nếu là admin
      const updateData = {};
      if (!user.googleId) updateData.googleId = googleId;
      if (!user.avatar && picture) updateData.avatar = picture;
      if (!user.fullName && name) updateData.fullName = name;
      if (!user.name && name) updateData.name = name;
      if (isAdmin && user.role !== 'ADMIN') updateData.role = 'ADMIN';

      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({ where: { id: user.id }, data: updateData });
      }
    } else {
      // Tạo user mới, tặng 50 Tinh Tú chào mừng
      user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email,
            googleId,
            fullName: name || email.split('@')[0],
            name: name || email.split('@')[0],
            avatar: picture,
            role: isAdmin ? 'ADMIN' : 'USER',
            starPoints: 50,
          },
        });

        // Ghi log WELCOME_BONUS
        await tx.starTransaction.create({
          data: {
            userId: newUser.id,
            amount: 50,
            type: 'WELCOME_BONUS',
            reason: 'Chào mừng bạn đến với Tarot Mystic Space!',
            performedBy: 'SYSTEM',
          },
        });

        return newUser;
      });
    }

    const token = signToken(user.id);

    // Loại bỏ thông tin nhạy cảm khỏi response
    const { ...safeUser } = user;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: safeUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
