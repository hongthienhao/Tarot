import prisma from '../config/prismaClient.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { calculateZodiacSign, calculateLifePathNumber } from '../utils/astrology.js';

/**
 * Các trường an toàn được phép trả về trong profile
 */
const USER_SELECT_FIELDS = {
  id: true,
  email: true,
  fullName: true,
  name: true,
  avatar: true,
  birthDate: true,
  gender: true,
  city: true,
  zodiacSign: true,
  numerologyLifePath: true,
  role: true,
  starPoints: true,
  isBanned: true,
  createdAt: true,
};

export const getProfile = catchAsync(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: USER_SELECT_FIELDS,
  });

  if (!user) {
    return next(new AppError('Không tìm thấy người dùng.', 404, 'NOT_FOUND'));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const { fullName, name, birthDate, gender, city } = req.body;

  let updateData = {};
  
  // Hỗ trợ cả 'fullName' và 'name' (alias tương thích ngược)
  if (fullName !== undefined) {
    updateData.fullName = fullName;
    updateData.name = fullName; // Đồng bộ alias
  } else if (name !== undefined) {
    updateData.name = name;
    updateData.fullName = name; // Đồng bộ alias
  }
  
  if (gender !== undefined) updateData.gender = gender;
  if (city !== undefined) updateData.city = city;
  
  if (birthDate !== undefined) {
    updateData.birthDate = birthDate;
    updateData.zodiacSign = calculateZodiacSign(birthDate);
    updateData.numerologyLifePath = calculateLifePathNumber(birthDate);
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
    select: USER_SELECT_FIELDS,
  });

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

export const getMyTransactions = catchAsync(async (req, res) => {
  const transactions = await prisma.starTransaction.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  res.status(200).json({
    status: 'success',
    data: { transactions },
  });
});
