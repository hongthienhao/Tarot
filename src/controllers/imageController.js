import axios from 'axios';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

/**
 * GET /api/v1/images/:filename
 * Proxy hình ảnh từ Cloudinary về client để giấu URL thực của Cloudinary.
 */
export const getImage = catchAsync(async (req, res, next) => {
  const { filename } = req.params;
  
  if (!filename) {
    return next(new AppError('Vui lòng cung cấp tên file hình ảnh.', 400));
  }

  // Tên thư mục trên Cloudinary (nếu có), ví dụ: 'tarot_cards'
  const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || 'tarot_cards';
  const cloudinaryName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!cloudinaryName) {
    return next(new AppError('Hệ thống chưa cấu hình Cloudinary.', 500));
  }

  // Construct Cloudinary URL
  // Cấu trúc URL: https://res.cloudinary.com/<cloud_name>/image/upload/<folder>/<filename>
  const cloudinaryUrl = `https://res.cloudinary.com/${cloudinaryName}/image/upload/${cloudinaryFolder}/${filename}`;

  try {
    const response = await axios({
      method: 'GET',
      url: cloudinaryUrl,
      responseType: 'stream',
    });

    // Set headers tương ứng với hình ảnh
    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache 1 ngày

    // Pipe stream từ Cloudinary thẳng về client
    response.data.pipe(res);
  } catch (error) {
    console.error(`Không thể tải ảnh từ Cloudinary: ${cloudinaryUrl}`);
    return next(new AppError('Không tìm thấy hình ảnh.', 404));
  }
});
