# 🎁 TAROT MYSTIC SPACE — ROADMAP: HỆ THỐNG GIFTCODE & THÔNG BÁO VŨ TRỤ (COSMIC GIFTCODE & NOTIFICATIONS)

> **Mục tiêu tính năng**
>
> Xây dựng hệ thống quản lý, phát hành và quy đổi **Mật Mã Tinh Tú (Giftcode)** toàn diện kèm **Trung Tâm Thông Báo Vũ Trụ (Cosmic Notification Center)** trên Navbar. Cho phép Admin phát hành mã quà tặng sự kiện (Public/Event Codes), tự động gửi thông báo Broadcast đến toàn bộ người dùng, và mang lại trải nghiệm nhận quà rực rỡ với hiệu ứng pháo hoa sao vàng (*Star Burst*).

---

## 1. Kiến Trúc Dữ Liệu (Database Schema)

```prisma
// ── Model Giftcode (Mật Mã Quà Tặng) ──
model Giftcode {
  id          String               @id @default(uuid())
  code        String               @unique // Mã viết hoa không dấu, vd: "MOON2026", "LUCKYSTAR"
  amount      Int                  // Số Tinh Tú nhận được (ví dụ: 20, 50, 100)
  maxUses     Int?                 // Tổng lượt dùng tối đa toàn hệ thống (null = không giới hạn)
  usedCount   Int                  @default(0) // Số lượt đã được nhập
  expiresAt   DateTime?            // Hạn sử dụng (null = vĩnh viễn)
  isActive    Boolean              @default(true)
  createdBy   String               // Admin ID tạo mã
  createdAt   DateTime             @default(now())
  updatedAt   DateTime             @updatedAt
  redemptions GiftcodeRedemption[]
}

// ── Model GiftcodeRedemption (Lịch Sử Nhập Mã Của User) ──
model GiftcodeRedemption {
  id         String   @id @default(uuid())
  giftcodeId String
  giftcode   Giftcode @relation(fields: [giftcodeId], references: [id], onDelete: Cascade)
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  reward     Int
  createdAt  DateTime @default(now())

  @@unique([giftcodeId, userId]) // Đảm bảo 1 User chỉ nhập được 1 mã duy nhất 1 lần
}

// ── Model Notification (Hệ Thống Thông Báo) ──
model Notification {
  id          String             @id @default(uuid())
  title       String             // Tiêu đề: "🎁 Mật Mã Tinh Tú Ngày Trăng Tròn!"
  message     String             // Nội dung chi tiết
  type        NotificationType   @default(GIFTCODE) // GIFTCODE, SYSTEM, EVENT, SUPPORT
  giftcode    String?            // Đính kèm mã để user bấm "Nhận Ngay"
  expiresAt   DateTime?
  createdAt   DateTime           @default(now())
  userNotifs  UserNotification[]
}

// ── Model UserNotification (Trạng Thái Đã Đọc / Đã Nhận) ──
model UserNotification {
  id             String       @id @default(uuid())
  userId         String
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  notificationId String
  notification   Notification @relation(fields: [notificationId], references: [id], onDelete: Cascade)
  isRead         Boolean      @default(false)
  isClaimed      Boolean      @default(false)
  createdAt      DateTime     @default(now())

  @@unique([userId, notificationId])
}

enum NotificationType {
  GIFTCODE
  SYSTEM
  EVENT
  SUPPORT
}
```

---

## 2. API Contract & Response Format

### 🛡️ Admin Endpoints (Yêu cầu `role === 'ADMIN'`)
* `POST /api/v1/admin/giftcodes`: Tạo Giftcode mới (có tùy chọn `sendBroadcastNotification: true`).
* `GET /api/v1/admin/giftcodes`: Lấy danh sách Giftcode (lọc theo trạng thái, số lượt dùng, hết hạn).
* `PATCH /api/v1/admin/giftcodes/:id/toggle`: Kích hoạt / Hủy kích hoạt mã.
* `DELETE /api/v1/admin/giftcodes/:id`: Xóa Giftcode và các liên kết.
* `POST /api/v1/admin/notifications/broadcast`: Gửi thông báo toàn hệ thống đến tất cả người dùng.

### 👤 User Endpoints (Yêu cầu `protect`)
* `POST /api/v1/giftcodes/redeem`:
  * **Body**: `{ "code": "MOON2026" }`
  * **Success Response (`200 OK`)**:
    ```json
    {
      "status": "success",
      "data": {
        "reward": 50,
        "newStarPoints": 150,
        "code": "MOON2026",
        "message": "Chúc mừng bạn đã nhận thành công +50 Tinh Tú!"
      }
    }
    ```
  * **Error Codes**:
    * `400 GIFTCODE_NOT_FOUND`: Mã quà tặng không tồn tại hoặc đã bị vô hiệu.
    * `400 GIFTCODE_EXPIRED`: Mã quà tặng đã hết hạn sử dụng.
    * `400 GIFTCODE_MAX_USES_REACHED`: Mã quà tặng đã hết lượt nhập.
    * `400 GIFTCODE_ALREADY_REDEEMED`: Bạn đã nhập mã này trước đó rồi.
* `GET /api/v1/notifications`: Lấy danh sách thông báo của User (kèm số lượng chưa đọc).
* `PATCH /api/v1/notifications/:id/read`: Đánh dấu thông báo là đã đọc.
* `PATCH /api/v1/notifications/read-all`: Đánh dấu toàn bộ là đã đọc.

---

## 3. Các Giai Đoạn Thực Hiện (Phases)

### 🔹 PHASE 1: Cơ Sở Dữ Liệu & Logic Backend (Core Engine)
- [ ] Cập nhật `prisma/schema.prisma` với 4 Model (`Giftcode`, `GiftcodeRedemption`, `Notification`, `UserNotification`).
- [ ] Chạy `npx prisma db push` hoặc migration cập nhật Database.
- [ ] Viết `src/controllers/giftcodeController.js`:
  - Xử lý `redeemGiftcode` bằng atomic transaction:
    1. Tìm Giftcode (chuyển chữ hoa, trim whitespace).
    2. Kiểm tra `isActive`, `expiresAt`, `maxUses > usedCount`.
    3. Kiểm tra user đã nhập chưa qua `GiftcodeRedemption`.
    4. Tăng `usedCount + 1`, tạo record `GiftcodeRedemption`.
    5. Cộng Tinh Tú `User.starPoints + amount`.
    6. Ghi log `StarTransaction` (`type: ADMIN_GRANT`, `reason: "Đổi Giftcode MOON2026"`).
- [ ] Viết `src/controllers/notificationController.js` (lấy danh sách, đánh dấu đọc, tạo broadcast).
- [ ] Khai báo routes trong `src/routes/giftcodeRoutes.js`, `src/routes/notificationRoutes.js`.

### 🔹 PHASE 2: Quản Trị Admin (Admin Giftcode Tab)
- [ ] Thêm Tab **"Mã Quà Tặng (Giftcodes)"** trong [AdminPage.jsx](file:///c:/LEARN_CODE/Demo_Project/TAROT/TarotProject/frontend/src/pages/AdminPage.jsx).
- [ ] Xây dựng Modal Tạo Giftcode:
  - Nhập mã (hỗ trợ nút *Random Code*), số Tinh Tú tặng, giới hạn số lượt, ngày hết hạn.
  - Checkbox: *"Tự động gửi thông báo đến chuông tất cả người dùng"*.
- [ ] Bảng danh sách Giftcode: hiển thị Mã, Tinh Tú, Lượt nhập (`usedCount/maxUses`), Trạng thái, Ngày hết hạn, Nút bật/tắt và xóa.

### 🔹 PHASE 3: Trải Nghiệm Người Dùng (Frontend User Experience)
- [ ] **Chuông Thông Báo Navbar (Cosmic Notification Bell)**:
  - Thêm biểu tượng Chuông (`Bell`) cạnh avatar trên Navbar với badge số đỏ khi có thông báo mới.
  - Dropdown hiển thị các thông báo gần nhất (Icon Tinh tú, Tiêu đề, Thời gian).
  - Bấm vào thông báo Giftcode sẽ có nút **"Nhập Ngay"** tự điền và nhận điểm tức thì.
- [ ] **Khung Nhập Giftcode Trong Hồ Sơ (Tab Tinh Tú)**:
  - Thêm ô nhập mã quà tặng tại trang `/profile?tab=stars`.
  - Hiệu ứng pháo hoa sao vàng bung tỏa (`Star Burst Confetti Animation`) khi nhập mã thành công.
  - Tự động đồng bộ số dư Tinh Tú trên Navbar.

### 🔹 PHASE 4: Kiểm Thử & Chống Gian Lận (Concurrency & Security Testing)
- [ ] Test trường hợp 2 user cùng nhập lượt cuối cùng của Giftcode (`maxUses` = 1) đồng thời ➔ Đảm bảo chỉ đúng 1 user thành công, 1 user báo hết lượt.
- [ ] Test nhập mã giả mạo, mã hết hạn, mã đã nhập trước đó.
- [ ] Build kiểm tra toàn bộ frontend & backend không có lỗi.

---

## 4. Tiêu Chí Hoàn Thành (Definition of Done)
1. Admin tạo mã và phát thông báo Broadcast thành công.
2. User nhìn thấy chuông thông báo phát sáng và có thông báo mới.
3. User nhập mã hợp lệ nhận đúng số Tinh Tú, có hiệu ứng pháo hoa sao vàng và ghi nhận vào lịch sử giao dịch.
4. Ngăn chặn 100% việc nhập lặp lại mã quà tặng hoặc gian lận vượt quá số lượt dùng.
