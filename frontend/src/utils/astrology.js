/**
 * Utility functions for Astrology (Zodiac Sign) and Numerology (Life Path Number) on Frontend
 */

export const calculateZodiacSign = (birthDateStr) => {
  if (!birthDateStr) return null;
  const date = new Date(birthDateStr);
  if (isNaN(date.getTime())) return null;

  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Bạch Dương (Aries ♈)';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Kim Ngưu (Taurus ♉)';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Song Tử (Gemini ♊)';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cự Giải (Cancer ♋)';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Sư Tử (Leo ♌)';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Xử Nữ (Virgo ♍)';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Thiên Bình (Libra ♎)';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Bọ Cạp (Scorpio ♏)';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Nhân Mã (Sagittarius ♐)';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Ma Kết (Capricorn ♑)';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Bảo Bình (Aquarius ♒)';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Song Ngư (Pisces ♓)';

  return null;
};

export const calculateLifePathNumber = (birthDateStr) => {
  if (!birthDateStr) return null;
  
  const digits = birthDateStr.replace(/\D/g, '');
  if (!digits || digits.length < 8) return null;

  let sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);

  while (sum > 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }

  return sum;
};

export const LIFE_PATH_MEANINGS = {
  2: 'Con số Hợp tác, Hòa bình, Thấu cảm & Giao tiếp tinh tế.',
  3: 'Con số Sáng tạo, Khả năng truyền cảm hứng & Sự diễn đạt rực rỡ.',
  4: 'Con số Thực tế, Kỷ luật, Xây dựng nền tảng vững chắc & Bền bỉ.',
  5: 'Con số Tự do, Khám phá, Trải nghiệm phong phú & Thích nghi.',
  6: 'Con số Chăm sóc, Trách nhiệm, Yêu thương & Chữa lành gia đình.',
  7: 'Con số Triết học, Chiêm nghiệm, Tìm kiếm sự thật & Trí tuệ sâu sắc.',
  8: 'Con số Quyền lực, Thành tựu tài chính, Lãnh đạo & Khái niệm nhân quả.',
  9: 'Con số Nhân ái, Phụng sự cộng đồng, Buông bỏ & Tốt đẹp vĩ đại.',
  10: 'Con số Thích ứng linh hoạt, Đột phá bản thân & Đa tài.',
  11: 'Master Number: Trực giác siêu việt, Tiên phong tâm linh & Truyền cảm hứng.',
  22: 'Master Number: Kiến tạo tầm vóc, Biến ước mơ thành hiện thực lớn lao.',
  33: 'Master Number: Bậc thầy chữa lành, Tình yêu vô điều kiện & Ánh sáng chỉ đường.'
};
