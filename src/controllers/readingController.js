import prisma from '../config/prismaClient.js';
import AppError from '../utils/appError.js';

export const getUserReadings = async (req, res, next) => {
  try {
    const readings = await prisma.reading.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        readingCards: {
          include: {
            card: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      status: 'success',
      results: readings.length,
      data: {
        readings,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const saveReading = async (req, res, next) => {
  try {
    const { 
      cards, 
      notes, 
      spreadName, 
      userQuestion, 
      interpretation 
    } = req.body;

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return next(new AppError('Vui lòng cung cấp danh sách lá bài', 400));
    }

    const newReading = await prisma.reading.create({
      data: {
        userId: req.user.id,
        spreadName,
        userQuestion,
        interpretation,
        notes,
        readingCards: {
          create: cards.map((card, index) => ({
            cardId: card.cardId || card.id,
            position: card.position || index + 1,
            isReversed: card.isReversed || false,
          })),
        },
      },
      include: {
        readingCards: {
          include: {
            card: true,
          },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        reading: newReading,
      },
    });
  } catch (error) {
    console.error('Error in saveReading:', error);
    next(error);
  }
};

export const deleteReading = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if reading exists and belongs to the user
    const reading = await prisma.reading.findUnique({
      where: { id },
    });

    if (!reading) {
      return next(new AppError('Không tìm thấy bản ghi trải bài', 404));
    }

    if (reading.userId !== req.user.id) {
      return next(new AppError('Bạn không có quyền xóa bản ghi này', 403));
    }

    // Xóa các bản ghi con trước để tránh lỗi foreign key constraint
    await prisma.readingCard.deleteMany({
      where: { readingId: id }
    });

    await prisma.reading.delete({
      where: { id },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMultipleReadings = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return next(new AppError('Vui lòng cung cấp danh sách ID các trải bài cần xóa', 400));
    }

    // Lấy thông tin các trải bài thuộc về user để xác nhận trước khi xóa
    const readings = await prisma.reading.findMany({
      where: {
        id: { in: ids },
        userId: req.user.id
      },
      select: {
        id: true,
        spreadName: true,
        createdAt: true
      }
    });

    if (readings.length === 0) {
      return next(new AppError('Không tìm thấy trải bài nào hợp lệ để xóa', 404));
    }

    const validIds = readings.map(r => r.id);

    // Xóa các bản ghi con trước để tránh lỗi foreign key constraint
    await prisma.readingCard.deleteMany({
      where: {
        readingId: { in: validIds }
      }
    });

    // Sau đó mới xóa các bản ghi cha
    await prisma.reading.deleteMany({
      where: {
        id: { in: validIds }
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        deletedCount: validIds.length,
        deletedReadings: readings
      }
    });
  } catch (error) {
    next(error);
  }
};

