import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cardsDir = path.join(__dirname, 'public', 'assets', 'cards');

async function optimizeImages() {
  try {
    const files = fs.readdirSync(cardsDir);
    const jpegFiles = files.filter(f => f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.jpg'));
    
    console.log(`Tìm thấy ${jpegFiles.length} file ảnh. Đang bắt đầu tối ưu hóa...`);
    let savedBytes = 0;

    for (const file of jpegFiles) {
      const filePath = path.join(cardsDir, file);
      const tempPath = path.join(cardsDir, `temp_${file}`);
      
      const stats = fs.statSync(filePath);
      const originalSize = stats.size;

      // Nén ảnh: Resize width xuống tối đa 800px (đủ nét cho thẻ bài) và giảm quality
      await sharp(filePath)
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true })
        .toFile(tempPath);
        
      const newStats = fs.statSync(tempPath);
      const newSize = newStats.size;
      
      // Xóa file cũ và đổi tên file mới
      fs.unlinkSync(filePath);
      fs.renameSync(tempPath, filePath);
      
      const diff = originalSize - newSize;
      savedBytes += diff;
      
      console.log(`✅ Đã nén ${file}: ${(originalSize / 1024 / 1024).toFixed(2)}MB -> ${(newSize / 1024).toFixed(2)}KB`);
    }

    console.log(`\n🎉 HOÀN TẤT! Đã giảm được ${(savedBytes / 1024 / 1024).toFixed(2)} MB tổng dung lượng.`);
    console.log(`Bây giờ bạn có thể commit và push lên Vercel để thấy tốc độ bàn thờ!`);

  } catch (error) {
    console.error('Lỗi khi nén ảnh:', error);
  }
}

optimizeImages();
