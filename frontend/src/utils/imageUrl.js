import { getApiBaseURL } from '../api/client';

/**
 * Lấy URL hình ảnh an toàn từ backend proxy
 * @param {string} originalPath - Đường dẫn cũ (vd: /assets/cards/the-fool.jpg)
 * @returns {string} - URL qua API (vd: http://localhost:3000/api/v1/images/the-fool.jpg)
 */
export const getProtectedImageUrl = (originalPath) => {
  if (!originalPath) return '';
  if (originalPath.startsWith('http')) return originalPath;

  const filename = originalPath.split('/').pop();
  return `${getApiBaseURL()}/images/${filename}`;
};
