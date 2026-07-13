/**
 * Utility functions for Astrology (Zodiac Sign) and Numerology (Life Path Number) on Frontend
 */

export const ZODIAC_DETAILS = {
  'Aries': { name: 'Bạch Dương (Aries ♈)', element: 'Hỏa 🔥', rulingPlanet: 'Sao Hỏa ♂', vibe: 'Dũng cảm, Tiên phong, Năng lượng nhiệt huyết rực rỡ' },
  'Taurus': { name: 'Kim Ngưu (Taurus ♉)', element: 'Thổ 🌿', rulingPlanet: 'Sao Kim ♀', vibe: 'Vững chãi, Kiên định, Trân trọng giá trị và bình yên' },
  'Gemini': { name: 'Song Tử (Gemini ♊)', element: 'Khí 💨', rulingPlanet: 'Sao Thủy ☿', vibe: 'Linh hoạt, Tinh anh, Khao khát học hỏi & Kết nối' },
  'Cancer': { name: 'Cự Giải (Cancer ♋)', element: 'Thủy 💧', rulingPlanet: 'Mặt Trăng ☽', vibe: 'Trực giác nhạy bén, Giàu tình cảm, Bảo vệ & Chữa lành' },
  'Leo': { name: 'Sư Tử (Leo ♌)', element: 'Hỏa 🔥', rulingPlanet: 'Mặt Trời ☉', vibe: 'Rực rỡ, Tự tin, Tỏa sáng & Truyền cảm hứng mãnh liệt' },
  'Virgo': { name: 'Xử Nữ (Virgo ♍)', element: 'Thổ 🌿', rulingPlanet: 'Sao Thủy ☿', vibe: 'Tỉ mỉ, Trí tuệ sắc bén, Chu đáo & Hoàn thiện bản thân' },
  'Libra': { name: 'Thiên Bình (Libra ♎)', element: 'Khí 💨', rulingPlanet: 'Sao Kim ♀', vibe: 'Cân bằng, Nhã nhặn, Yêu cái đẹp & Sự hài hòa' },
  'Scorpio': { name: 'Bọ Cạp (Scorpio ♏)', element: 'Thủy 💧', rulingPlanet: 'Sao Diêm Vương ♇', vibe: 'Sâu sắc, Quyến rũ bí ẩn, Sức mạnh tái sinh mạnh mẽ' },
  'Sagittarius': { name: 'Nhân Mã (Sagittarius ♐)', element: 'Hỏa 🔥', rulingPlanet: 'Sao Mộc ♃', vibe: 'Phóng khoáng, Yêu tự do, Triết lý & Khám phá chân lý' },
  'Capricorn': { name: 'Ma Kết (Capricorn ♑)', element: 'Thổ 🌿', rulingPlanet: 'Sao Thổ ♄', vibe: 'Nghị lực, Trách nhiệm, Bản lĩnh kiến tạo tương lai' },
  'Aquarius': { name: 'Bảo Bình (Aquarius ♒)', element: 'Khí 💨', rulingPlanet: 'Sao Thiên Vương ♅', vibe: 'Đột phá, Độc đáo, Tầm nhìn thời đại & Ý tưởng mới' },
  'Pisces': { name: 'Song Ngư (Pisces ♓)', element: 'Thủy 💧', rulingPlanet: 'Sao Hải Vương ♆', vibe: 'Mộng mơ, Thấu cảm vũ trụ, Tâm hồn nghệ sĩ sâu sắc' }
};

export const calculateZodiacSign = (birthDateStr) => {
  const details = getZodiacDetails(birthDateStr);
  return details ? details.name : null;
};

export const getZodiacDetails = (birthDateStr) => {
  if (!birthDateStr) return null;
  const date = new Date(birthDateStr);
  if (isNaN(date.getTime())) return null;

  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  let key = null;
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) key = 'Aries';
  else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) key = 'Taurus';
  else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) key = 'Gemini';
  else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) key = 'Cancer';
  else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) key = 'Leo';
  else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) key = 'Virgo';
  else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) key = 'Libra';
  else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) key = 'Scorpio';
  else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) key = 'Sagittarius';
  else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) key = 'Capricorn';
  else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) key = 'Aquarius';
  else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) key = 'Pisces';

  if (!key || !ZODIAC_DETAILS[key]) return null;

  return {
    key,
    ...ZODIAC_DETAILS[key]
  };
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
  1: 'Con số Tiên phong, Lãnh đạo, Độc lập & Sáng tạo khởi đầu.',
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

