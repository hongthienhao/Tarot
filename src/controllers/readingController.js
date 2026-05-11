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
    const { notes, cards } = req.body;
    // cards should be an array of objects: { cardId, position, isReversed }

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return next(new AppError('Vui lòng cung cấp danh sách lá bài', 400));
    }

    const newReading = await prisma.reading.create({
      data: {
        userId: req.user.id,
        notes,
        readingCards: {
          create: cards.map((card, index) => ({
            cardId: card.cardId,
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
    next(error);
  }
};
