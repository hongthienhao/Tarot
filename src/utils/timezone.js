import { toZonedTime, format } from 'date-fns-tz';

const TZ = 'Asia/Ho_Chi_Minh';

/**
 * Trả về ngày hôm nay dạng "YYYY-MM-DD" theo múi giờ Việt Nam.
 * @returns {string} "YYYY-MM-DD"
 */
export const getTodayVN = () => {
  const now = new Date();
  const zoned = toZonedTime(now, TZ);
  return format(zoned, 'yyyy-MM-dd', { timeZone: TZ });
};

/**
 * Trả về thứ trong tuần theo giờ Việt Nam (0 = Chủ Nhật, 1 = Thứ 2, ... 6 = Thứ 7).
 * @returns {number} 0–6
 */
export const getDayOfWeekVN = () => {
  const now = new Date();
  const zoned = toZonedTime(now, TZ);
  return zoned.getDay();
};

/**
 * Tính thưởng Tinh Tú dựa vào thứ trong tuần:
 * - Thứ 2 → Thứ 6 (1–5): +1 Tinh Tú
 * - Thứ 7 (6): +2 Tinh Tú
 * - Chủ Nhật (0): +3 Tinh Tú
 * @param {number} dayOfWeek - 0 (CN) đến 6 (T7)
 * @returns {number}
 */
export const getCheckinReward = (dayOfWeek) => {
  if (dayOfWeek === 0) return 3;   // Chủ Nhật
  if (dayOfWeek === 6) return 2;   // Thứ 7
  return 1;                         // Thứ 2 – Thứ 6
};

/**
 * Lấy ngày đầu tuần (Thứ 2) của tuần hiện tại theo giờ VN
 * @returns {string} "YYYY-MM-DD"
 */
export const getWeekStartVN = () => {
  const now = new Date();
  const zoned = toZonedTime(now, TZ);
  const dayOfWeek = zoned.getDay(); // 0 = CN, 1 = T2
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Thứ 2 là đầu tuần
  const weekStart = new Date(zoned);
  weekStart.setDate(zoned.getDate() + diff);
  return format(weekStart, 'yyyy-MM-dd', { timeZone: TZ });
};

/**
 * Cộng thêm số ngày vào một chuỗi ngày "YYYY-MM-DD" mà không bị ảnh hưởng bởi UTC timezone shift
 * @param {string} baseDateStr - "YYYY-MM-DD"
 * @param {number} days - Số ngày cần cộng
 * @returns {string} "YYYY-MM-DD"
 */
export const addDaysVN = (baseDateStr, days) => {
  const [year, month, day] = baseDateStr.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day + days));
  return d.toISOString().slice(0, 10);
};
