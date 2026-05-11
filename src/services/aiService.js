import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI;

const buildSystemPrompt = (cards, spreadType) => {
  let cardsContext = cards.map((card, index) => {
    return `- Vị trí ${index + 1}: ${card.name} (${card.orientation})\n  Ý nghĩa cơ bản: ${card.message}`;
  }).join('\n');

  return `Bạn là một bậc thầy Tarot thấu cảm, thông thái và có khả năng chữa lành.
Bạn đang thực hiện một trải bài mang tên "${spreadType}".

Dưới đây là các lá bài đã được rút:
${cardsContext}

HƯỚNG DẪN DÀNH CHO BẠN:
1. Đừng chỉ giải thích từng lá bài một cách rời rạc. Hãy kết nối chúng lại thành một câu chuyện có ý nghĩa.
2. Phân tích sự liên kết giữa các lá bài (ví dụ: lá bài này củng cố hay mâu thuẫn với lá bài kia).
3. Sử dụng ngôn từ tinh tế, bay bổng nhưng dễ hiểu. Giọng điệu của bạn phải mang tính an ủi, định hướng và khích lệ (chữa lành).
4. Đưa ra một lời khuyên cốt lõi vào cuối phần giải bài.
5. Tuyệt đối không lặp lại nguyên văn các câu/từ đã nói ở đoạn trước. Hãy sử dụng từ vựng phong phú, liên tục phát triển ý tưởng mới.
6. Nếu người dùng hỏi thêm, hãy tiếp tục đóng vai Bậc thầy Tarot để trả lời dựa trên trải bài hiện tại.`;
};

export const streamTarotReading = async (cards, spreadType, message, history = []) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Hệ thống thiếu GEMINI_API_KEY.');
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  const systemPrompt = buildSystemPrompt(cards, spreadType);

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.8, // Thanh đo độ sáng tạo (0.0 - 2.0).
      topP: 0.9,        // Giới hạn xác suất từ ngữ, giúp câu văn tự nhiên hơn.
      topK: 40,
      maxOutputTokens: 2048,
    }
  });

  const formattedHistory = history.map(msg => ({
    role: msg.role === 'ai' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  try {
    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessageStream(message);
    return result.stream;
  } catch (error) {
    console.error('Error in streamTarotReading:', error);
    throw error;
  }
};

