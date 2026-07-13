/**
 * Utility functions for Astrology (Zodiac Sign) and Numerology (Life Path, Destiny, Personal Year)
 */

export const ZODIAC_DETAILS = {
  'Aries': { name: 'Bạch Dương (Aries ♈)', element: 'Hỏa 🔥', rulingPlanet: 'Sao Hỏa ♂', vibe: 'Dũng cảm, Tiên phong, Năng lượng nhiệt huyết rực rỡ', dateRange: '21/03 - 19/04', icon: '♈' },
  'Taurus': { name: 'Kim Ngưu (Taurus ♉)', element: 'Thổ 🌿', rulingPlanet: 'Sao Kim ♀', vibe: 'Vững chãi, Kiên định, Trân trọng giá trị và bình yên', dateRange: '20/04 - 20/05', icon: '♉' },
  'Gemini': { name: 'Song Tử (Gemini ♊)', element: 'Khí 💨', rulingPlanet: 'Sao Thủy ☿', vibe: 'Linh hoạt, Tinh anh, Khao khát học hỏi & Kết nối', dateRange: '21/05 - 20/06', icon: '♊' },
  'Cancer': { name: 'Cự Giải (Cancer ♋)', element: 'Thủy 💧', rulingPlanet: 'Mặt Trăng ☽', vibe: 'Trực giác nhạy bén, Giàu tình cảm, Bảo vệ & Chữa lành', dateRange: '21/06 - 22/07', icon: '♋' },
  'Leo': { name: 'Sư Tử (Leo ♌)', element: 'Hỏa 🔥', rulingPlanet: 'Mặt Trời ☉', vibe: 'Rực rỡ, Tự tin, Tỏa sáng & Truyền cảm hứng mãnh liệt', dateRange: '23/07 - 22/08', icon: '♌' },
  'Virgo': { name: 'Xử Nữ (Virgo ♍)', element: 'Thổ 🌿', rulingPlanet: 'Sao Thủy ☿', vibe: 'Tỉ mỉ, Trí tuệ sắc bén, Chu đáo & Hoàn thiện bản thân', dateRange: '23/08 - 22/09', icon: '♍' },
  'Libra': { name: 'Thiên Bình (Libra ♎)', element: 'Khí 💨', rulingPlanet: 'Sao Kim ♀', vibe: 'Cân bằng, Nhã nhặn, Yêu cái đẹp & Sự hài hòa', dateRange: '23/09 - 22/10', icon: '♎' },
  'Scorpio': { name: 'Bọ Cạp (Scorpio ♏)', element: 'Thủy 💧', rulingPlanet: 'Sao Diêm Vương ♇', vibe: 'Sâu sắc, Quyến rũ bí ẩn, Sức mạnh tái sinh mạnh mẽ', dateRange: '23/10 - 21/11', icon: '♏' },
  'Sagittarius': { name: 'Nhân Mã (Sagittarius ♐)', element: 'Hỏa 🔥', rulingPlanet: 'Sao Mộc ♃', vibe: 'Phóng khoáng, Yêu tự do, Triết lý & Khám phá chân lý', dateRange: '22/11 - 21/12', icon: '♐' },
  'Capricorn': { name: 'Ma Kết (Capricorn ♑)', element: 'Thổ 🌿', rulingPlanet: 'Sao Thổ ♄', vibe: 'Nghị lực, Trách nhiệm, Bản lĩnh kiến tạo tương lai', dateRange: '22/12 - 19/01', icon: '♑' },
  'Aquarius': { name: 'Bảo Bình (Aquarius ♒)', element: 'Khí 💨', rulingPlanet: 'Sao Thiên Vương ♅', vibe: 'Đột phá, Độc đáo, Tầm nhìn thời đại & Ý tưởng mới', dateRange: '20/01 - 18/02', icon: '♒' },
  'Pisces': { name: 'Song Ngư (Pisces ♓)', element: 'Thủy 💧', rulingPlanet: 'Sao Hải Vương ♆', vibe: 'Mộng mơ, Thấu cảm vũ trụ, Tâm hồn nghệ sĩ sâu sắc', dateRange: '19/02 - 20/03', icon: '♓' }
};

export const ZODIAC_COMPATIBILITY = {
  'Aries': { bestMatches: ['Sư Tử', 'Nhân Mã', 'Bảo Bình'], supportingElement: 'Khí 💨', note: 'Lửa gặp Khí rực cháy khát vọng và tinh thần quật khởi.' },
  'Taurus': { bestMatches: ['Xử Nữ', 'Ma Kết', 'Cự Giải'], supportingElement: 'Thủy 💧', note: 'Đất kết hợp Thủy mầm sống đơm hoa, nền tảng bình yên.' },
  'Gemini': { bestMatches: ['Thiên Bình', 'Bảo Bình', 'Bạch Dương'], supportingElement: 'Hỏa 🔥', note: 'Khí thổi bùng Lửa nhiệt huyết, trao đổi tư tưởng sắc bén.' },
  'Cancer': { bestMatches: ['Bọ Cạp', 'Song Ngư', 'Kim Ngưu'], supportingElement: 'Thổ 🌿', note: 'Thủy tưới mát Đất lành, chữa lành và bảo hộ vững chắc.' },
  'Leo': { bestMatches: ['Bạch Dương', 'Nhân Mã', 'Song Tử'], supportingElement: 'Khí 💨', note: 'Hỏa được Khí nuôi dưỡng, hào quang tỏa sáng vạn người mê.' },
  'Virgo': { bestMatches: ['Kim Ngưu', 'Ma Kết', 'Bọ Cạp'], supportingElement: 'Thủy 💧', note: 'Thổ gặp Thủy trở nên mềm mại, hiện thực hóa ước mơ.' },
  'Libra': { bestMatches: ['Song Tử', 'Bảo Bình', 'Sư Tử'], supportingElement: 'Hỏa 🔥', note: 'Khí kết giao Hỏa tạo nên những kết nối thẩm mỹ và thấu cảm.' },
  'Scorpio': { bestMatches: ['Cự Giải', 'Song Ngư', 'Xử Nữ'], supportingElement: 'Thổ 🌿', note: 'Thủy quyện vào Thổ đem lại sức mạnh biến chuyển tâm thức.' },
  'Sagittarius': { bestMatches: ['Bạch Dương', 'Sư Tử', 'Thiên Bình'], supportingElement: 'Khí 💨', note: 'Hỏa tung hoành cùng Khí tự do, tự do khám phá thế giới.' },
  'Capricorn': { bestMatches: ['Kim Ngưu', 'Xử Nữ', 'Bọ Cạp'], supportingElement: 'Thủy 💧', note: 'Thổ dung nạp Thủy bền bỉ vượt mọi thử thách cuộc đời.' },
  'Aquarius': { bestMatches: ['Song Tử', 'Thiên Bình', 'Bạch Dương'], supportingElement: 'Hỏa 🔥', note: 'Khí gặp Hỏa khai phá ý tưởng mang tầm vóc tương lai.' },
  'Pisces': { bestMatches: ['Cự Giải', 'Bọ Cạp', 'Kim Ngưu'], supportingElement: 'Thổ 🌿', note: 'Thủy nương tựa Thổ biến cảm hứng nghệ thuật thành hiện thực.' }
};

export const DAILY_ZODIAC_FORECASTS = {
  'Aries': { energyScore: 92, luckyCard: 'The Sun (Mặt Trời)', advice: 'Hôm nay ngọn lửa Hỏa thôi thúc bạn tiên phong. Đừng ngần ngại đưa ra quyết định quan trọng.' },
  'Taurus': { energyScore: 88, luckyCard: 'The Empress (Hoàng Hậu)', advice: 'Năng lượng Thổ mang lại sự điềm tĩnh và thịnh vượng. Hãy chăm sóc bản thân và gia đình.' },
  'Gemini': { energyScore: 95, luckyCard: 'The Magician (Nhà Băng Nhẫn)', advice: 'Sao Thủy bảo hộ mang đến sự thông tuệ xuất sắc. Hôm nay là ngày đại cát để đàm phán & học hỏi.' },
  'Cancer': { energyScore: 85, luckyCard: 'The High Priestess (Nữ Tư Tế)', advice: 'Trực giác Mặt Trăng cực kỳ nhạy bén. Hãy tin vào tiếng nói bên trong hơn lời đồn thổi.' },
  'Leo': { energyScore: 90, luckyCard: 'Strength (Sức Mạnh)', advice: 'Mặt Trời chiếu rọi tự tin rực rỡ. Sự bao dung và phong thái tự tin sẽ chinh phục mọi khoảng cách.' },
  'Virgo': { energyScore: 87, luckyCard: 'The Hermit (Ẩn Sĩ)', advice: 'Sao Thủy soi sáng chi tiết. Tĩnh tâm và sắp xếp lại kế hoạch dài hạn sẽ đem tới quả ngọt.' },
  'Libra': { energyScore: 91, luckyCard: 'Justice (Công Lý)', advice: 'Sao Kim giữ thế cân bằng. Sự nhã nhặn và quyết định khách quan sẽ gặt hái kết quả viên mãn.' },
  'Scorpio': { energyScore: 94, luckyCard: 'Death (Tái Sinh)', advice: 'Năng lượng tái sinh mạnh mẽ giúp bạn buông bỏ gánh nặng quá khứ để bứt phá rực rỡ.' },
  'Sagittarius': { energyScore: 89, luckyCard: 'The Wheel of Fortune (Vòng Quay Vận Mệnh)', advice: 'Sao Mộc may mắn mở rộng cơ hội mới. Hãy mạo hiểm đón nhận những chân trời rộng mở.' },
  'Capricorn': { energyScore: 93, luckyCard: 'The Emperor (Hoàng Đế)', advice: 'Sao Thổ kiên cố kiến tạo uy thế. Kỷ luật vững vàng sẽ biến thử thách thành nấc thang.' },
  'Aquarius': { energyScore: 96, luckyCard: 'The Star (Ngôi Sao)', advice: 'Sao Thiên Vương mang tới nguồn cảm hứng sáng tạo vô tận. Hãy tin vào tầm nhìn độc đáo của bạn.' },
  'Pisces': { energyScore: 86, luckyCard: 'The Moon (Mặt Trăng)', advice: 'Dòng chảy Thủy dạt dào cảm xúc. Hãy dành thời gian thả lỏng tâm trí và theo đuổi đam mê nghệ thuật.' }
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
    ...ZODIAC_DETAILS[key],
    compatibility: ZODIAC_COMPATIBILITY[key],
    forecast: DAILY_ZODIAC_FORECASTS[key]
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

/**
 * Calculate Destiny Number from User Name using Pythagorean Numerology system
 */
export const calculateDestinyNumber = (nameStr) => {
  if (!nameStr) return null;
  
  const letterValues = {
    A: 1, J: 1, S: 1,
    B: 2, K: 2, T: 2,
    C: 3, L: 3, U: 3,
    D: 4, M: 4, V: 4,
    E: 5, N: 5, W: 5,
    F: 6, O: 6, X: 6,
    G: 7, P: 7, Y: 7,
    H: 8, Q: 8, Z: 8,
    I: 9, R: 9
  };

  const cleanName = nameStr.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
  if (!cleanName) return null;

  let sum = 0;
  for (let char of cleanName) {
    sum += letterValues[char] || 0;
  }

  while (sum > 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }

  return sum;
};

/**
 * Calculate Personal Year Number for the user in a given year (e.g. 2026)
 */
export const calculatePersonalYearNumber = (birthDateStr, currentYear = 2026) => {
  if (!birthDateStr) return null;
  const date = new Date(birthDateStr);
  if (isNaN(date.getTime())) return null;

  const day = date.getDate();
  const month = date.getMonth() + 1;

  let sumStr = `${day}${month}${currentYear}`;
  let sum = sumStr.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);

  while (sum > 9) {
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

export const DESTINY_MEANINGS = {
  1: 'Khát vọng chinh phục thế giới, trở thành người dẫn đường đầy bản lĩnh.',
  2: 'Sứ mệnh gắn kết tâm hồn, mang lại sự bình an và hòa giải mọi bất hòa.',
  3: 'Sứ mệnh tỏa sáng qua nghệ thuật, ngôn từ và khả năng truyền lửa ấm áp.',
  4: 'Sứ mệnh tạo lập trật tự, kiến thiết công trình và đem lại sự an tâm tuyệt đối.',
  5: 'Sứ mệnh mở đường tự do, vượt qua rào cản và đem lại sự đổi mới kỳ diệu.',
  6: 'Sứ mệnh che chở, vỗ về và làm hậu phương hạnh phúc cho những người xung quanh.',
  7: 'Sứ mệnh kiếm tìm trí tuệ tối thượng, mang ánh sáng tri thức khai phóng số mệnh.',
  8: 'Sứ mệnh kiến tạo thịnh vượng, điều hành nguồn lực và làm chủ thành công.',
  9: 'Sứ mệnh phụng sự nhân loại, lan tỏa lòng trắc ẩn và chữa lành thế giới.',
  10: 'Sứ mệnh bứt phá giới hạn, biến điều tưởng như không thể thành hiện thực.',
  11: 'Sứ mệnh ngọn hải đăng tâm linh, đánh thức năng lượng tinh thần cho muôn người.',
  22: 'Sứ mệnh vị kiến trúc sư huyền thoại, hiện thực hóa giấc mơ vĩ đại của thời đại.',
  33: 'Sứ mệnh nguồn năng lượng chữa lành vô tận, mang lại hy vọng và niềm tin yêu.'
};

export const PERSONAL_YEAR_MEANINGS = {
  1: 'Năm Khởi Đầu Mới: Gieo mầm ý tưởng, dũng cảm bắt đầu hành trình đột phá.',
  2: 'Năm Nuôi Dưỡng & Kết Nối: Kiên nhẫn tích lũy, củng cố các mối quan hệ tri kỷ.',
  3: 'Năm Tỏa Sáng & Sáng Tạo: Bộc lộ tài năng, mở rộng giao tiếp và đón nhận niềm vui.',
  4: 'Năm Nền Tảng & Kỷ Luật: Củng cố sức khỏe, tài chính và xây dựng sự nghiệp vững chắc.',
  5: 'Năm Biến Động & Tự Do: Chuyển mình, trải nghiệm những cơ hội bất ngờ thú vị.',
  6: 'Năm Gia Đình & Trách Nhiệm: Chăm sóc không gian sống, gắn kết yêu thương người thân.',
  7: 'Năm Tĩnh Tâm & Chiêm Nghiệm: Quay vào bên trong, phát triển tri thức và tâm linh.',
  8: 'Năm Thành Tựu & Nhân Quả: Thu hoạch quả ngọt sự nghiệp, gặt hái tài chính xứng đáng.',
  9: 'Năm Hoàn Tất & Buông Bỏ: Dọn dẹp điều cũ, chuẩn bị tinh thần bước vào chu kỳ 9 năm mới.'
};
