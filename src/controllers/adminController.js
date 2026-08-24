import prisma from '../config/prismaClient.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

const normalizeEmail = (email) => email?.toLowerCase().trim();

// ──────────────────────────────────────────────
// STATS
// ──────────────────────────────────────────────

/**
 * GET /api/v1/admin/stats
 * Thống kê tổng quan hệ thống
 */
export const getStats = catchAsync(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [totalUsers, newUsersToday, totalStarPoints, totalReadings, blacklistCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.user.aggregate({ _sum: { starPoints: true } }),
    prisma.reading.count(),
    prisma.blacklist.count(),
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      newUsersToday,
      totalStarPointsInSystem: totalStarPoints._sum.starPoints || 0,
      totalReadings,
      blacklistCount,
    },
  });
});

// ──────────────────────────────────────────────
// USERS
// ──────────────────────────────────────────────

/**
 * GET /api/v1/admin/users
 * Danh sách người dùng (phân trang, tìm kiếm)
 */
export const getUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || '';
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ role: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        email: true,
        fullName: true,
        name: true,
        avatar: true,
        role: true,
        starPoints: true,
        isBanned: true,
        bannedAt: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    },
  });
});

/**
 * PATCH /api/v1/admin/users/:id/stars
 * Cấp hoặc Trừ Tinh Tú cho user
 */
export const adjustStars = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { amount, reason } = req.body;

  if (typeof amount !== 'number' || amount === 0) {
    return next(new AppError('Số lượng Tinh Tú phải là số khác 0.', 400, 'INVALID_REQUEST'));
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return next(new AppError('Không tìm thấy người dùng.', 404, 'NOT_FOUND'));

  const type = amount > 0 ? 'ADMIN_GRANT' : 'ADMIN_DEDUCT';

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id },
      data: { starPoints: { increment: amount } },
      select: { id: true, email: true, fullName: true, starPoints: true },
    }),
    prisma.starTransaction.create({
      data: {
        userId: id,
        amount,
        type,
        reason: reason || (amount > 0 ? 'Admin cấp Tinh Tú' : 'Admin trừ Tinh Tú'),
        performedBy: req.user.id,
      },
    }),
  ]);

  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

/**
 * PATCH /api/v1/admin/users/:id/ban
 * Khóa/Mở khóa tài khoản
 */
export const toggleBan = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (id === req.user.id) {
    return next(new AppError('Không thể tự ban chính mình.', 400, 'SELF_BAN'));
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return next(new AppError('Không tìm thấy người dùng.', 404, 'NOT_FOUND'));
  if (user.role === 'ADMIN') {
    return next(new AppError('Không thể khóa tài khoản ADMIN.', 400, 'CANNOT_BAN_ADMIN'));
  }

  const newBanState = !user.isBanned;

  const [updatedUser] = await prisma.$transaction(async (tx) => {
    const u = await tx.user.update({
      where: { id },
      data: {
        isBanned: newBanState,
        bannedAt: newBanState ? new Date() : null,
      },
      select: { id: true, email: true, fullName: true, isBanned: true, bannedAt: true },
    });

    if (newBanState) {
      // Đồng bộ thêm vào Blacklist nếu chưa có
      const existing = await tx.blacklist.findUnique({ where: { email: user.email } });
      if (!existing) {
        await tx.blacklist.create({
          data: {
            email: user.email,
            reason: 'Khóa tài khoản bởi Quản Trị Viên',
            bannedBy: req.user.id,
          },
        });
      }
    } else {
      // Mở khóa: gỡ khỏi Blacklist nếu có
      await tx.blacklist.deleteMany({ where: { email: user.email } });
    }

    return [u];
  });

  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

/**
 * DELETE /api/v1/admin/users/:id
 * Xóa tài khoản user
 */
export const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return next(new AppError('Không tìm thấy người dùng.', 404, 'NOT_FOUND'));
  if (user.role === 'ADMIN') {
    return next(new AppError('Không thể xóa tài khoản ADMIN.', 400, 'CANNOT_DELETE_ADMIN'));
  }

  await prisma.$transaction(async (tx) => {
    // 1. Xóa Blacklist liên quan đến email user
    await tx.blacklist.deleteMany({ where: { email: user.email } });

    // 2. Xóa các lá bài trong các lần rút bài (ReadingCards)
    const readings = await tx.reading.findMany({ where: { userId: id }, select: { id: true } });
    const readingIds = readings.map((r) => r.id);
    if (readingIds.length > 0) {
      await tx.readingCard.deleteMany({ where: { readingId: { in: readingIds } } });
    }

    // 3. Xóa toàn bộ lịch sử trải bài Tarot (Readings)
    await tx.reading.deleteMany({ where: { userId: id } });

    // 4. Xóa toàn bộ biến động Tinh Tú (StarTransactions)
    await tx.starTransaction.deleteMany({ where: { userId: id } });

    // 5. Xóa lịch sử điểm danh hàng ngày (Checkins)
    await tx.checkin.deleteMany({ where: { userId: id } });

    // 6. Xóa tài khoản User chính
    await tx.user.delete({ where: { id } });
  });

  res.status(200).json({ status: 'success', message: 'Đã xóa toàn bộ dữ liệu và tài khoản thành công.' });
});

// ──────────────────────────────────────────────
// BLACKLIST
// ──────────────────────────────────────────────

export const getBlacklist = catchAsync(async (req, res) => {
  const list = await prisma.blacklist.findMany({ orderBy: { createdAt: 'desc' } });
  res.status(200).json({ status: 'success', data: { list } });
});

export const addToBlacklist = catchAsync(async (req, res, next) => {
  const { email, reason } = req.body;
  if (!email) return next(new AppError('Email là bắt buộc.', 400, 'INVALID_REQUEST'));

  const normalized = normalizeEmail(email);

  try {
    const entry = await prisma.$transaction(async (tx) => {
      const b = await tx.blacklist.create({
        data: { email: normalized, reason: reason || 'Khóa bởi Admin', bannedBy: req.user.id },
      });
      // Nếu user có trong DB, tự động khóa tài khoản
      await tx.user.updateMany({
        where: { email: normalized },
        data: { isBanned: true },
      });
      return b;
    });
    res.status(201).json({ status: 'success', data: { entry } });
  } catch (err) {
    if (err.code === 'P2002') {
      return next(new AppError('Email này đã có trong danh sách đen.', 400, 'DUPLICATE_BLACKLIST'));
    }
    throw err;
  }
});

export const removeFromBlacklist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const entry = await prisma.blacklist.findUnique({ where: { id } });
  if (!entry) return next(new AppError('Không tìm thấy email trong danh sách đen.', 404, 'NOT_FOUND'));

  await prisma.$transaction(async (tx) => {
    await tx.blacklist.delete({ where: { id } });
    // Nếu user có trong DB, tự động mở khóa tài khoản
    await tx.user.updateMany({
      where: { email: entry.email },
      data: { isBanned: false },
    });
  });

  res.status(200).json({ status: 'success', message: 'Đã xóa email khỏi danh sách đen.' });
});

// ──────────────────────────────────────────────
// TRANSACTIONS
// ──────────────────────────────────────────────

/**
 * GET /api/v1/admin/transactions
 * Lịch sử giao dịch Tinh Tú toàn hệ thống (phân trang)
 */
export const getTransactions = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.starTransaction.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, fullName: true, name: true } },
      },
    }),
    prisma.starTransaction.count(),
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      transactions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    },
  });
});

/**
 * GET /api/v1/admin/star-summaries
 * Thống kê tổng hợp Tinh Tú theo từng người dùng (Cộng, Trừ, Số dư)
 */
export const getStarSummaries = catchAsync(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
      name: true,
      avatar: true,
      role: true,
      starPoints: true,
      transactions: {
        select: {
          id: true,
          amount: true,
          type: true,
          reason: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: [
      { role: 'asc' },
      { email: 'asc' },
    ],
  });

  const summaries = users.map((u) => {
    let totalDeducted = 0;
    let totalAdded = 0;
    (u.transactions || []).forEach((tx) => {
      if (tx.amount < 0) {
        totalDeducted += Math.abs(tx.amount);
      } else {
        totalAdded += tx.amount;
      }
    });

    return {
      userId: u.id,
      email: u.email,
      fullName: u.fullName || u.name || 'Lữ Khách',
      avatar: u.avatar,
      role: u.role,
      currentPoints: u.starPoints,
      totalDeducted,
      totalAdded,
      transactionCount: (u.transactions || []).length,
      transactions: u.transactions || [],
    };
  });

  res.status(200).json({
    status: 'success',
    data: { summaries },
  });
});
