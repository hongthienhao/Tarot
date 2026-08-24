import prisma from '../config/prismaClient.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { getTodayVN, getDayOfWeekVN, getCheckinReward, getWeekStartVN, addDaysVN } from '../utils/timezone.js';

/**
 * POST /api/v1/checkin
 * Điểm danh hàng ngày: thưởng Tinh Tú theo thứ trong tuần.
 * Atomic transaction chống race condition.
 */
export const dailyCheckin = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const todayVN = getTodayVN();
  const dayOfWeek = getDayOfWeekVN();
  const reward = getCheckinReward(dayOfWeek);

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Tạo bản ghi Checkin — sẽ ném lỗi unique constraint nếu đã điểm danh
      const checkin = await tx.checkin.create({
        data: {
          userId,
          date: todayVN,
          reward,
        },
      });

      // Cộng Tinh Tú cho user
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { starPoints: { increment: reward } },
        select: { starPoints: true },
      });

      // Ghi StarTransaction
      await tx.starTransaction.create({
        data: {
          userId,
          amount: reward,
          type: 'CHECKIN_REWARD',
          reason: `Điểm danh ngày ${todayVN}`,
          performedBy: 'SYSTEM',
        },
      });

      return { checkin, newStarPoints: updatedUser.starPoints };
    });

    res.status(200).json({
      status: 'success',
      data: {
        checkedIn: true,
        reward,
        date: todayVN,
        newStarPoints: result.newStarPoints,
      },
    });
  } catch (err) {
    // P2002 = Unique constraint failed → đã điểm danh hôm nay
    if (err.code === 'P2002') {
      return next(new AppError('Bạn đã điểm danh hôm nay rồi.', 400, 'ALREADY_CHECKED_IN'));
    }
    throw err;
  }
});

/**
 * GET /api/v1/checkin/status
 * Trả về trạng thái điểm danh: hôm nay, tuần này.
 */
export const getCheckinStatus = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const todayVN = getTodayVN();
  const weekStartVN = getWeekStartVN();
  const dayOfWeek = getDayOfWeekVN();
  const todayReward = getCheckinReward(dayOfWeek);

  // Kiểm tra đã check-in hôm nay chưa
  const todayCheckin = await prisma.checkin.findUnique({
    where: { userId_date: { userId, date: todayVN } },
  });

  // Lấy danh sách check-in tuần này (Thứ 2 → hôm nay)
  const weekCheckins = await prisma.checkin.findMany({
    where: {
      userId,
      date: { gte: weekStartVN, lte: todayVN },
    },
    orderBy: { date: 'asc' },
  });

  // Tính tổng Tinh Tú nhận tuần này
  const totalThisWeek = weekCheckins.reduce((sum, c) => sum + c.reward, 0);

  // Tạo progress map 7 ngày trong tuần (T2–CN)
  const weekProgress = Array.from({ length: 7 }, (_, i) => {
    // i=0 → Thứ 2, i=6 → Chủ Nhật
    const dayIndex = i === 6 ? 0 : i + 1; // Convert to JS day: T2=1, ..., T7=6, CN=0
    const reward = getCheckinReward(dayIndex);
    
    // Tính ngày chuẩn của thứ này trong tuần hiện tại không bị lệch timezone
    const dateStr = addDaysVN(weekStartVN, i);
    
    const checkin = weekCheckins.find((c) => c.date === dateStr);
    return {
      dayIndex, // 0=CN, 1=T2, ...6=T7
      dayLabel: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][dayIndex],
      date: dateStr,
      reward,
      checked: !!checkin,
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      checkedInToday: !!todayCheckin,
      todayReward,
      weekProgress,
      totalThisWeek,
      todayDate: todayVN,
      weekStart: weekStartVN,
    },
  });
});
