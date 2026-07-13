# 🔮 TAROT MYSTIC SPACE - DỰ ÁN NÂNG CẤP & KHÔNG GIAN BÍ ẨN

Tài liệu này dùng để theo dõi tiến độ nâng cấp webapp Tarot Mystic Space.

---

## 📌 BẢNG CHECKLIST NÂNG CẤP (UPGRADE ROADMAP)

### 🟢 PHA 1: NÂNG CẤP AI READER, GIỌNG NÓI TTS & CÁ TÍNH AI
- [x] **1.1 Tích hợp Gemini AI Engine thực tế**
  - Viết `src/services/aiService.js` tích hợp Gemini 2.5 Flash API streaming chuyên sâu.
- [x] **1.2 Bộ 4 Cá tính AI Reader (AI Tarot Personas)**
  - *Mystic Sage* (Bà đồng / Nhà hiền triết bí ẩn)
  - *Empathetic Healer* (Thầy chữa lành dịu dàng)
  - *Brutally Honest Oracle* (Thần quẻ bói thẳng, thực tế)
  - *Cosmic Scholar* (Học giả vũ trụ & biểu tượng học)
- [x] **1.3 Trình phát Giọng nói Chuyên nghiệp (Text-to-Speech Audio)**
  - Phát âm thanh lời giải bài bằng giọng nói truyền cảm với nút Đọc/Tạm dừng/Tiếp tục ngay trên từng tin nhắn AI.

---

### 🟢 PHA 2: HỒ SƠ CÁ NHÂN, CUNG HOÀNG ĐẠO & THẦN SỐ HỌC (CHI TIẾT & TRANG CHỦ)
- [x] **2.1 Nâng cấp CSDL Prisma**
  - Thêm `zodiacSign`, `birthDate`, `numerologyLifePath` vào model `User` trong Prisma schema và database.
- [x] **2.2 Bộ Dữ Liệu Chiêm Tinh & Thần Số Học Chi Tiết (`astrology.js`)**
  - Phân loại **Nguyên tố bản mệnh (Hỏa 🔥 / Thổ 🌿 / Khí 💨 / Thủy 💧)**, **Hành tinh trị vì (Ruling Planet)** và **Mã năng lượng Vibe** cho toàn bộ 12 Cung Hoàng Đạo.
  - Tự động tính toán Con số chủ đạo (Life Path 1-9, Master Numbers 11, 22, 33) với bộ ý nghĩa biểu tượng chi tiết.
- [x] **2.3 Modal Hồ Sơ Nguyên Khí Nâng Cấp (`UserProfileModal.jsx`)**
  - Giao diện Mystical Glassmorphism hỗ trợ tính toán thời gian thực Cung Hoàng Đạo, Badge Nguyên tố, Sao trị vì và Thần số học kèm diễn giải trực quan.
- [x] **2.4 Widget Năng Lượng Chiêm Tinh Cá Nhân Trên Trang Chủ (`Hero.jsx`)**
  - Tích hợp **Astro Vibe Widget** nổi bật ngay vị trí trung tâm Trang Chủ (Hero section).
  - Tự động hiển thị Badge Cung + Nguyên Tố + Số Chủ Đạo nếu đã có ngày sinh, hoặc Banner bí ẩn gọi mời người dùng cài đặt hồ sơ chỉ với 1 click.
- [x] **2.5 Tích hợp Chiêm Tinh Sâu vào Gemini AI Engine (`aiService.js`)**
  - Đưa thông số Nguyên tố & Hành tinh bảo hộ vào System Prompt của Gemini AI 2.5 Flash để luận quẻ Tarot khớp hoàn toàn với năng lượng bản mệnh người dùng.

---

### 🟢 PHA 3: MỞ RỘNG TRẢI BÀI & LÁ BÀI HẰNG NGÀY (DAILY TAROT)
- [x] **3.1 Trải bài mở rộng**
  - Trải bài **Relationship / Mối quan hệ Đôi lứa (7 lá)**.
  - Trải bài **Celtic Cross Huyền thoại (10 lá)**.
- [x] **3.2 Lá bài Hằng ngày (Daily Tarot Widget) & Streak Counter (`DailyTarotModal.jsx`)**
  - Rút bài mỗi ngày, lưu vết và hiển thị chuỗi Streak tích lũy kèm giải luận AI tự động và đọc TTS.

---

### 🟢 PHA 4: NHẬT KÝ TRẢI BÀI & CHIA SẺ MẠNG XÃ HỘI
- [x] **4.1 Ghi chú nhật ký & Gắn thẻ bài**
  - Cho phép người dùng gắn tag (*Tình yêu, Sự nghiệp, Tài chính, Tâm linh, Hằng ngày*) và lọc lịch sử trải bài theo thẻ.
- [x] **4.2 Thẻ Chia sẻ Mạng xã hội (Social Share Card - `ShareCardModal.jsx`)**
  - Tạo ảnh thiết kế viền vàng huyền bí độ phân giải cao để tải về hoặc sao chép liên kết chia sẻ lên MXH.

---

*Lưu ý: Mọi tiến độ sẽ được tích dấu `[x]` ngay khi hoàn thành từng tính năng.*
