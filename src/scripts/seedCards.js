import fs from 'fs/promises';
import path from 'path';
import prisma from '../config/prismaClient.js';
import { cardsData } from '../data/cardsData.js';

const CARDS_DIR = path.resolve('public/assets/cards');

async function seed() {
  console.log('🚀 Bắt đầu quá trình "thổi hồn" vào bộ bài Tarot...');

  try {
    const files = await fs.readdir(CARDS_DIR);
    const jpegFiles = files.filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg'));

    console.log(`📂 Tìm thấy ${jpegFiles.length} tệp tin hình ảnh.`);

    let successCount = 0;

    for (const filename of jpegFiles) {
      // Ví dụ: C01_Ace_of_Cups.jpeg -> code: C01, name: Ace of Cups
      const basename = path.parse(filename).name;
      const [code, ...nameParts] = basename.split('_');
      const displayName = nameParts.join(' ');
      
      const arcanaPrefix = code[0];
      const cardNumber = parseInt(code.substring(1));

      let arcana = 'MINOR';
      let suit = null;

      switch (arcanaPrefix) {
        case 'M':
          arcana = 'MAJOR';
          break;
        case 'W':
          suit = 'WANDS';
          break;
        case 'C':
          suit = 'CUPS';
          break;
        case 'S':
          suit = 'SWORDS';
          break;
        case 'P':
          suit = 'PENTACLES';
          break;
        default:
          console.warn(`⚠️ Cảnh báo: Không xác định được loại bài cho tệp ${filename}`);
          continue;
      }

      const dataContent = cardsData[code];
      if (!dataContent) {
        console.warn(`⚠️ Cảnh báo: Thiếu nội dung mô tả cho mã bài ${code} (${filename})`);
        continue;
      }

      // Upsert dữ liệu vào Database
      await prisma.tarotCard.upsert({
        where: { name: displayName },
        update: {
          arcana,
          suit,
          number: cardNumber,
          meaningUpright: dataContent.meaningUpright,
          meaningReversed: dataContent.meaningReversed,
          imagePath: `/assets/cards/${filename}`
        },
        create: {
          name: displayName,
          arcana,
          suit,
          number: cardNumber,
          meaningUpright: dataContent.meaningUpright,
          meaningReversed: dataContent.meaningReversed,
          imagePath: `/assets/cards/${filename}`
        }
      });

      successCount++;
    }

    console.log(`✅ Hoàn tất! Đã cập nhật thành công ${successCount}/78 lá bài.`);
  } catch (error) {
    console.error('❌ Lỗi trong quá trình seed dữ liệu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
