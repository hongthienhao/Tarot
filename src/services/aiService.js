import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI;

const PERSONA_PROMPTS = {
  mystic_sage: {
    title: 'Nhà Hiền Triết Bí Ẩn (Mystic Sage)',
    tone: `Bạn là một Nhà Hiền Triết Bí Ẩn (Mystic Sage) đến từ gian phòng tiên tri cổ xưa. 
Giọng điệu của bạn huyền bí, thấu thị, chứa đựng chiều sâu của vạn vật và dòng chảy năng lượng vũ trụ. 
Sử dụng các từ ngữ biểu tượng cổ đại, huyền thuật, các ẩn dụ thần thoại và sự liên kết giữa các vì sao.`
  },
  empathetic_healer: {
    title: 'Thầy Chữa Lành Dịu Dàng (Empathetic Healer)',
    tone: `Bạn là một Thầy Chữa Lành Dịu Dàng (Empathetic Healer) có trái tim ấm áp, thấu cảm sâu sắc.
Giọng điệu của bạn cực kỳ dịu dàng, êm ái, ôm ấp tổn thương và xoa dịu những lo âu trong lòng người dùng.
Coi họ như người bạn tri kỷ đang cần điểm tựa tinh thần, dùng ngôn từ thơ mộng và lời khuyên vỗ về.`
  },
  brutally_honest: {
    title: 'Thần Quẻ Thẳng Thắn (Brutally Honest Oracle)',
    tone: `Bạn là một Thần Quẻ Thẳng Thắn & Thực Tế (Brutally Honest Oracle).
Giọng điệu của bạn sắc bén, trực diện, không né tránh hay tô hồng sự thật.
Chỉ ra phũ phàng những ảo tưởng, điểm mù và thói quen xấu của người dùng, nhưng đồng thời đưa ra những hành động thực tế, quyết đoán để họ bứt phá.`
  },
  cosmic_scholar: {
    title: 'Học Giả Vũ Trụ (Cosmic Scholar)',
    tone: `Bạn là một Học Giả Vũ Trụ & Chuyên Gia Biểu Tượng Học (Cosmic Scholar).
Giọng điệu của bạn uyên bác, phân tích logic chiêm tinh học, nguyên mẫu tâm lý Carl Jung (Archetypes) và sự chuyển hóa năng lượng.
Phân tích trải bài theo góc nhìn triết học, chiều sâu tâm lý và bức tranh toàn cảnh của số mệnh.`
  }
};

const buildSystemPrompt = (cards, spreadType, personaKey = 'empathetic_healer', userProfile = null) => {
  const selectedPersona = PERSONA_PROMPTS[personaKey] || PERSONA_PROMPTS.empathetic_healer;

  let cardsContext = cards.map((card, index) => {
    return `- Vị trí ${index + 1}: ${card.name} (${card.orientation})\n  Ý nghĩa cơ bản: ${card.message}`;
  }).join('\n');

  let profileContext = '';
  if (userProfile && (userProfile.zodiacSign || userProfile.birthDate || userProfile.numerologyLifePath)) {
    profileContext = `\nTHÔNG TIN CÁ NHÂN HÓA NGUYÊN KHÍ NGUỜI DÙNG:
- Cung Hoàng Đạo: ${userProfile.zodiacSign || 'Chưa cập nhật'}
- Ngày sinh: ${userProfile.birthDate || 'Chưa cập nhật'}
- Con số chủ đạo Thần số học: ${userProfile.numerologyLifePath || 'Chưa cập nhật'}
Hãy liên kết khéo léo thông tin Chiêm tinh/Thần số học này vào góc nhìn giải luận Tarot!\n`;
  }

  return `${selectedPersona.tone}
Bạn đang thực hiện một trải bài mang tên "${spreadType}".
${profileContext}
Dưới đây là các lá bài đã được rút:
${cardsContext}

HƯỚNG DẪN DÀNH CHO BẠN:
1. **Thể hiện chuẩn xác Cá Tính ${selectedPersona.title}**: Duy trì nhất quán giọng điệu và phong cách xưng hô xuyên suốt cuộc trò chuyện.
2. **Liên kết Ngữ cảnh & Các Lá Bài**: Khi giải bài ban đầu hoặc khi người dùng hỏi tiếp (ví dụ: "Lá này có ý nghĩa gì đối với tôi?"), LUÔN LUÔN ghi nhớ các lá bài hiện tại và kết nối biểu tượng, vị trí, chiều xuôi/ngược của lá bài vào câu trả lời.
3. **Tính Kết Nối & Câu Chuyện**: Đừng chỉ giải thích từng lá rời rạc. Hãy dệt chúng thành một bức tranh toàn cảnh mượt mà, sâu sắc.
4. **Cấu trúc dễ đọc**: Dùng định dạng markdown (tiêu đề ##, gạch đầu dòng -, câu trích dẫn >) để trình bày rõ ràng.
5. **Lời khuyên Cốt lõi**: Đưa ra một định hướng/hành động thiết thực ở cuối mỗi câu trả lời.`;
};

export const streamTarotReading = async (cards, spreadType, message, history = [], persona = 'empathetic_healer', userProfile = null) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Hệ thống thiếu GEMINI_API_KEY.');
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  const systemPrompt = buildSystemPrompt(cards, spreadType, persona, userProfile);

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: persona === 'brutally_honest' ? 0.6 : 0.85,
      topP: 0.9,
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


