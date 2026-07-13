import prisma from '../config/prismaClient.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { calculateZodiacSign, calculateLifePathNumber } from '../utils/astrology.js';

export const getProfile = catchAsync(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      birthDate: true,
      zodiacSign: true,
      numerologyLifePath: true,
      createdAt: true,
    }
  });

  if (!user) {
    return next(new AppError('Không tìm thấy người dùng.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const { name, birthDate } = req.body;

  let updateData = {};
  if (name !== undefined) updateData.name = name;
  if (birthDate !== undefined) {
    updateData.birthDate = birthDate;
    updateData.zodiacSign = calculateZodiacSign(birthDate);
    updateData.numerologyLifePath = calculateLifePathNumber(birthDate);
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      birthDate: true,
      zodiacSign: true,
      numerologyLifePath: true,
      createdAt: true,
    }
  });

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});
