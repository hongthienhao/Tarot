import prisma from '../config/prismaClient.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

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

export const drawCards = catchAsync(async (req, res, next) => {
  const { quantity = 3 } = req.body;

  if (typeof quantity !== 'number' || quantity < 1 || quantity > 78) {
    return next(new AppError('Số lượng lá bài không hợp lệ. Vui lòng chọn từ 1 đến 78.', 400));
  }

  const spreadInfo = getSpreadInfo(quantity);

  // 1. Lấy tất cả các lá bài từ Database
  // Trong thực tế, nếu DB lớn, ta có thể chỉ lấy IDs trước. Nhưng với 78 lá, lấy hết cũng nhanh.
  const allCards = await prisma.tarotCard.findMany();

  if (!allCards || allCards.length === 0) {
    return next(new AppError('Không tìm thấy dữ liệu bài Tarot. Vui lòng kiểm tra lại hệ thống.', 404));
  }

  // 2. Xáo bài và chọn ra N lá
  const shuffledCards = shuffleArray([...allCards]);
  const selectedCards = shuffledCards.slice(0, quantity);

  // 3. Xử lý trạng thái xuôi/ngược và xây dựng spread map
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

  res.status(200).json({
    status: 'success',
    data: {
      spreadName: spreadInfo.name,
      description: spreadInfo.description,
      quantity,
      drawnAt: new Date().toISOString(),
      cards
    }
  });
});
