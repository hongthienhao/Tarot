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

### 🟢 PHA 2: HỒ SƠ CÁ NHÂN, CUNG HOÀNG ĐẠO & THẦN SỐ HỌC
- [x] **2.1 Nâng cấp CSDL Prisma**
  - Thêm `zodiacSign`, `birthDate`, `numerologyLifePath` vào model `User` trong Prisma schema và database.
- [x] **2.2 Modal Cấu hình Ngày sinh & Cung Hoàng Đạo (`UserProfileModal.jsx`)**
  - Tự động tính Cung Hoàng Đạo & Con số chủ đạo (Life Path Number) dựa trên ngày sinh với xem trước thời gian thực.
- [x] **2.3 Tích hợp Chiêm tinh vào Lời giải Tarot**
  - Tự động kết nối Cung Hoàng Đạo & Thần số học của người dùng vào prompt Gemini AI để đưa ra góc nhìn cá nhân hóa tối đa.

---

### 🟢 PHA 3: MỞ RỘNG TRẢI BÀI & LÁ BÀI HẰNG NGÀY (DAILY TAROT)
- [ ] **3.1 Trải bài mở rộng**
  - Trải bài **Relationship / Mối quan hệ Đôi lứa (7 lá)**.
  - Trải bài **Celtic Cross Huyền thoại (10 lá)**.
- [ ] **3.2 Lá bài Hằng ngày (Daily Tarot Widget) & Streak Counter**
  - Rút bài mỗi ngày, lưu vết và hiển thị chuỗi Streak tích lũy.

---

### 🟢 PHA 4: NHẬT KÝ TRẢI BÀI & CHIA SẺ MẠNG XÃ HỘI
- [ ] **4.1 Ghi chú nhật ký & Gắn thẻ bài**
  - Cho phép người dùng gắn tag (Tình yêu, Sự nghiệp, Tiền tài, Tự ngẫm) và chỉnh sửa note sau khi trải bài.
- [ ] **4.2 Thẻ Chia sẻ Mạng xã hội (Social Share Card)**
  - Tạo ảnh thiết kế đẹp mắt của quẻ bài để tải về hoặc share Facebook / Zalo.

---

*Lưu ý: Mọi tiến độ sẽ được tích dấu `[x]` ngay khi hoàn thành từng tính năng.*
