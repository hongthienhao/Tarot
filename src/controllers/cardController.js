import prisma from '../config/prismaClient.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { streamTarotReading } from '../services/aiService.js';
import { getTodayVN, getDayOfWeekVN, getCheckinReward } from '../utils/timezone.js';

const SPREADS = {
  insight: { name: 'The Insight (Tuệ Giác)', quantity: 1, description: 'Phản hồi nhanh và trực tiếp cho tâm hồn.' },
  crossroads: { name: 'The Crossroads (Ngã Rẽ)', quantity: 2, description: 'Thấu thị hai mặt của một lựa chọn hoặc sự so sánh.' },
  flow: { name: 'The Flow of Time (Dòng Chảy Thời Gian)', quantity: 3, description: 'Kết nối Quá khứ – Hiện tại – Tương lai.' },
  compass: { name: 'The Inner Compass (La Bàn Tâm Hồn)', quantity: 5, description: 'Phân tích sâu sắc các khía cạnh của một vấn đề.' },
  celtic: { name: 'The Celtic Cross (Hành Trình Định Mệnh)', quantity: 10, description: 'Trải bài kinh điển, đi sâu vào gốc rễ và định hướng tương lai.' },
  infinite: { name: 'The Infinite Path (Hành Trình Vô Tận)', description: 'Dành cho những yêu cầu tùy biến hoặc trải bài chuyên sâu.' }
};

const getSpreadInfo = (quantity) => {
  if (quantity === 1) return SPREADS.insight;
  if (quantity === 2) return SPREADS.crossroads;
  if (quantity === 3) return SPREADS.flow;
  if (quantity >= 5 && quantity <= 7) return SPREADS.compass;
  if (quantity === 10) return SPREADS.celtic;
  return { ...SPREADS.infinite, quantity };
};

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

let cachedCards = null;

const getCards = async () => {
  if (!cachedCards || cachedCards.length === 0) {
    cachedCards = await prisma.tarotCard.findMany({
      orderBy: [
        { arcana: 'asc' },
        { suit: 'asc' },
        { number: 'asc' }
      ]
    });
  }
  return cachedCards;
};

/**
 * Thực hiện tự động check-in khi user rút bài Daily (nếu chưa check-in hôm nay).
 * @returns {{ checked: boolean, reward: number }}
 */
const autoCheckinIfNeeded = async (userId) => {
  const todayVN = getTodayVN();
  const dayOfWeek = getDayOfWeekVN();
  const reward = getCheckinReward(dayOfWeek);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.checkin.create({ data: { userId, date: todayVN, reward } });
      await tx.user.update({
        where: { id: userId },
        data: { starPoints: { increment: reward } },
      });
      await tx.starTransaction.create({
        data: {
          userId,
          amount: reward,
          type: 'CHECKIN_REWARD',
          reason: `Điểm danh qua Daily Tarot ngày ${todayVN}`,
          performedBy: 'SYSTEM',
        },
      });
    });
    return { checked: true, reward };
  } catch (err) {
    if (err.code === 'P2002') {
      // Đã check-in hôm nay rồi (race condition hoặc đã điểm danh trước)
      return { checked: false, reward: 0 };
    }
    throw err;
  }
};

/**
 * POST /api/v1/cards/draw
 * Rút bài Tarot. Hỗ trợ:
 * - isDaily: true → miễn phí, tự động check-in nếu đã đăng nhập
 * - isDaily: false/undefined → bắt buộc auth, trừ 1 Tinh Tú atomic
 */
export const drawCards = catchAsync(async (req, res, next) => {
  const { quantity = 3, isDaily = false } = req.body;

  if (typeof quantity !== 'number' || quantity < 1 || quantity > 78) {
    return next(new AppError('Số lượng lá bài không hợp lệ. Vui lòng chọn từ 1 đến 78.', 400, 'INVALID_REQUEST'));
  }

  const spreadInfo = getSpreadInfo(quantity);
  const allCards = await getCards();

  if (!allCards || allCards.length === 0) {
    return next(new AppError('Không tìm thấy dữ liệu bài Tarot. Vui lòng kiểm tra lại hệ thống.', 404, 'NOT_FOUND'));
  }

  if (!req.user) {
    return next(new AppError('Bạn cần đăng nhập để kết nối với Vũ Trụ và rút bài.', 401, 'UNAUTHORIZED'));
  }

  let checkinResult = null;

  if (isDaily) {
    // === DAILY DRAW: Miễn phí, tự động check-in ===
    checkinResult = await autoCheckinIfNeeded(req.user.id);
  } else {
    // === DRAW THƯỜNG: Trừ Tinh Tú tương ứng số lượng lá bài (1 lá = 1 Tinh Tú) ===
    const cost = quantity; // 1 lá = 1 Tinh Tú (ví dụ 10 lá = 10 Tinh Tú)

    // Atomic UPDATE: chỉ trừ nếu starPoints >= cost
    const result = await prisma.user.updateMany({
      where: { id: req.user.id, starPoints: { gte: cost } },
      data: { starPoints: { decrement: cost } },
    });

    if (result.count === 0) {
      return next(new AppError(`Bạn không đủ Tinh Tú để rút trải bài này. Cần ${cost} Tinh Tú.`, 400, 'INSUFFICIENT_STAR_POINTS'));
    }

    // Ghi DRAW_COST transaction
    await prisma.starTransaction.create({
      data: {
        userId: req.user.id,
        amount: -cost,
        type: 'DRAW_COST',
        reason: `Rút ${quantity} lá bài (${cost} Tinh Tú)`,
        performedBy: 'SYSTEM',
      },
    });
  }

  // Xáo và chọn lá bài
  const shuffledCards = shuffleArray([...allCards]);
  const selectedCards = shuffledCards.slice(0, quantity);

  const cards = selectedCards.map((card, index) => {
    const isReversed = Math.random() < 0.5;
    return {
      position: index + 1,
      id: card.id,
      name: card.name,
      image: card.imagePath,
      isReversed,
      orientation: isReversed ? 'Ngược (Reversed)' : 'Xuôi (Upright)',
      message: isReversed ? card.meaningReversed : card.meaningUpright,
      arcana: card.arcana,
      suit: card.suit,
      number: card.number
    };
  });

  // Lấy starPoints mới nhất để trả về
  let updatedStarPoints = null;
  if (req.user) {
    const freshUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { starPoints: true },
    });
    updatedStarPoints = freshUser?.starPoints ?? null;
  }

  res.status(200).json({
    status: 'success',
    data: {
      spreadName: spreadInfo.name,
      description: spreadInfo.description,
      quantity,
      isDaily,
      drawnAt: new Date().toISOString(),
      cards,
      checkin: checkinResult,
      starPoints: updatedStarPoints,
    }
  });
});

export const generateReading = catchAsync(async (req, res, next) => {
  const { cards, spreadType, message, history, readingId, persona, userProfile } = req.body;

  if (!cards || !Array.isArray(cards) || cards.length === 0) {
    return next(new AppError('Vui lòng cung cấp danh sách các lá bài đã rút.', 400, 'INVALID_REQUEST'));
  }

  // Thiết lập Server-Sent Events (SSE) để stream dữ liệu
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const profile = userProfile || (req.user ? {
      zodiacSign: req.user.zodiacSign,
      birthDate: req.user.birthDate,
      numerologyLifePath: req.user.numerologyLifePath
    } : null);

    const stream = await streamTarotReading(
      cards,
      spreadType || 'Trải bài Tarot',
      message || 'Hãy giải bài giúp tôi.',
      history || [],
      persona || 'empathetic_healer',
      profile
    );

    let fullInterpretation = '';
    for await (const chunk of stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        fullInterpretation += chunkText;
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    let savedReadingId = readingId;

    // Tự động lưu vào Nhật ký linh hồn nếu đã đăng nhập
    if (req.user) {
      try {
        if (readingId) {
          const currentReading = await prisma.reading.findUnique({ where: { id: readingId } });

          if (!currentReading.interpretation) {
            await prisma.reading.update({
              where: { id: readingId },
              data: {
                userQuestion: message || 'Giải bài tổng quan',
                interpretation: fullInterpretation
              }
            });
          } else {
            const newNote = `**Bạn**: ${message || 'Hỏi thêm'}\n\n**Bậc thầy Tarot**: ${fullInterpretation}`;
            const updatedNotes = currentReading.notes ? `${currentReading.notes}\n\n---\n\n${newNote}` : newNote;
            await prisma.reading.update({ where: { id: readingId }, data: { notes: updatedNotes } });
          }
        } else {
          const newReading = await prisma.reading.create({
            data: {
              userId: req.user.id,
              spreadName: spreadType || 'Trải bài Tarot',
              userQuestion: message || 'Giải bài tổng quan',
              interpretation: fullInterpretation,
              readingCards: {
                create: cards.map((card, index) => ({
                  cardId: card.id,
                  position: card.position || index + 1,
                  isReversed: card.isReversed || false,
                })),
              },
            },
          });
          savedReadingId = newReading.id;
        }
      } catch (saveError) {
        console.error('Lỗi khi tự động lưu trải bài:', saveError);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true, readingId: savedReadingId })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Lỗi khi stream AI reading:', error);

    // === CƠ CHẾ REFUND: Hoàn trả Tinh Tú nếu draw thường bị lỗi ===
    // (isDaily draws không cần refund vì không trừ)
    const isDaily = req.body.isDaily || false;
    const refundAmount = Array.isArray(cards) ? cards.length : 1;
    if (!isDaily && req.user) {
      try {
        await prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: req.user.id },
            data: { starPoints: { increment: refundAmount } },
          });
          await tx.starTransaction.create({
            data: {
              userId: req.user.id,
              amount: refundAmount,
              type: 'REFUND',
              reason: `Hoàn trả ${refundAmount} Tinh Tú do lỗi xử lý AI`,
              performedBy: 'SYSTEM',
            },
          });
        });
        console.log(`✅ Refund ${refundAmount} Tinh Tú cho user ${req.user.id}`);
      } catch (refundErr) {
        console.error('Lỗi khi refund Tinh Tú:', refundErr);
      }
    }

    res.write(`data: ${JSON.stringify({ error: 'Tín hiệu kết nối với Bậc thầy Tarot bị gián đoạn.' })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

/**
 * Fetch all Tarot cards in a highly structured order (Major Arcana first, followed by Minor Arcana suits)
 */
export const getAllCards = catchAsync(async (req, res, next) => {
  const cards = await getCards();

  res.status(200).json({
    status: 'success',
    results: cards.length,
    data: { cards }
  });
});
