# 💬 TAROT MYSTIC SPACE — ROADMAP: KÊNH CHAT TRỰC TIẾP USER - ADMIN (COSMIC IN-APP LIVE SUPPORT CHAT)

> **Mục tiêu tính năng**
>
> Xây dựng kênh giao tiếp trực tiếp 1-1 khép kín ngay trên Website giữa **Lữ Khách (User)** và **Bậc Thầy Tarot / Quản Trị Viên (Admin)**. Cho phép người dùng gửi câu hỏi, thắc mắc về trải bài, khiếu nại hoặc tâm sự tâm giao; Admin quản lý tập trung toàn bộ hộp thư hỗ trợ tại trang Quản trị (`/admin`) với khả năng phản hồi trực tiếp và tặng Tinh Tú ngay trong phiên chat.

---

## 1. Kiến Trúc Dữ Liệu (Database Schema)

```prisma
// ── Model SupportConversation (Phiên Hội Thoại 1-1) ──
model SupportConversation {
  id             String           @id @default(uuid())
  userId         String           @unique // Mỗi user gắn liền với 1 luồng chat liên tục với Admin
  user           User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  lastMessage    String?          // Tin nhắn mới nhất (phục vụ hiển thị preview ở danh sách)
  lastMessageAt  DateTime         @default(now())
  unreadByAdmin  Int              @default(0) // Số tin nhắn Admin chưa đọc từ User này
  unreadByUser   Int              @default(0) // Số tin nhắn User chưa đọc từ Admin
  isResolved     Boolean          @default(false) // Đánh dấu phiên đã giải quyết xong
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
  messages       SupportMessage[]
}

// ── Model SupportMessage (Nội Dung Tin Nhắn) ──
model SupportMessage {
  id             String              @id @default(uuid())
  conversationId String
  conversation   SupportConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  senderId       String              // User ID người gửi
  senderRole     Role                @default(USER) // USER hoặc ADMIN
  content        String              // Nội dung văn bản hoặc link trải bài
  grantedStars   Int?                // Nếu Admin kèm tặng Tinh Tú trong tin nhắn (ví dụ: +20)
  isRead         Boolean             @default(false)
  createdAt      DateTime            @default(now())
}
```

---

## 2. API Contract & Phản Hồi Chuẩn

### 👤 User Endpoints (Yêu cầu `protect`)
* `GET /api/v1/support/conversation`: Lấy thông tin phiên chat và danh sách tin nhắn của User hiện tại.
* `POST /api/v1/support/messages`: Gửi tin nhắn mới đến Admin.
  * **Body**: `{ "content": "Chào Bậc Thầy Tarot, tôi có thắc mắc về lá The Moon vừa rút..." }`
* `PATCH /api/v1/support/read`: Đánh dấu User đã đọc hết các phản hồi từ Admin (xóa badge chưa đọc).

### 🛡️ Admin Endpoints (Yêu cầu `role === 'ADMIN'`)
* `GET /api/v1/admin/support/conversations`: Lấy danh sách toàn bộ các cuộc hội thoại của người dùng (sắp xếp theo tin mới nhất, lọc theo chưa đọc/đã giải quyết).
* `GET /api/v1/admin/support/conversations/:id`: Lấy chi tiết lịch sử tin nhắn của một cuộc hội thoại cụ thể.
* `POST /api/v1/admin/support/conversations/:id/reply`: Admin gửi tin nhắn phản hồi đến User.
  * **Body**:
    ```json
    {
      "content": "Chào bạn, năng lượng lá The Moon hôm nay đang nhắc nhở bạn...",
      "grantStars": 20 // Tùy chọn: Tặng Tinh Tú trực tiếp trong tin nhắn
    }
    ```
* `PATCH /api/v1/admin/support/conversations/:id/resolve`: Đánh dấu phiên hỗ trợ đã hoàn tất.

---

## 3. Các Giai Đoạn Thực Hiện (Phases)

### 🔹 PHASE 1: Cơ Sở Dữ Liệu & Backend Messaging
- [ ] Cập nhật `prisma/schema.prisma` với 2 Model (`SupportConversation`, `SupportMessage`).
- [ ] Chạy `npx prisma db push` cập nhật Database.
- [ ] Viết `src/controllers/supportController.js`:
  - `getMyConversation`: Tìm hoặc tự động khởi tạo hội thoại mới cho User.
  - `sendUserMessage`: Thêm tin nhắn, cập nhật `lastMessage`, tăng `unreadByAdmin + 1`.
  - `markAsRead`: Reset `unreadByUser = 0`.
- [ ] Viết `src/controllers/adminSupportController.js`:
  - `getConversations`: Danh sách user chat kèm avatar, tên, số tin chưa đọc, thời gian.
  - `replyMessage`: Phản hồi tin nhắn, nếu có `grantStars` -> tự động cộng Tinh Tú và tạo log `StarTransaction`.
- [ ] Khai báo routes trong `src/routes/supportRoutes.js` và `src/routes/adminRoutes.js`.

### 🔹 PHASE 2: Hộp Thư Hỗ Trợ Admin (Admin Inbox Tab)
- [ ] Thêm Tab **"Hỗ Trợ & Tâm Giao (Support Inbox)"** trong [AdminPage.jsx](file:///c:/LEARN_CODE/Demo_Project/TAROT\TarotProject\frontend\src\pages\AdminPage.jsx).
- [ ] Thiết kế Layout 2 cột chuẩn Dashboard:
  - **Cột Trái (Danh sách hội thoại)**:
    - Tìm kiếm User theo tên/email.
    - Chấm đỏ nhấp nháy hiển thị số lượng tin nhắn chưa đọc (`unreadByAdmin`).
    - Lọc theo: *Tất cả*, *Chưa đọc*, *Đã hoàn tất*.
  - **Cột Phải (Khung chat chi tiết)**:
    - Hiển thị avatar, thông tin Cung hoàng đạo & số dư Tinh Tú của User đang chat.
    - Dòng thời gian tin nhắn phân biệt màu (Tin của User màu bạc, Tin của Admin màu vàng kim).
    - Khung nhập tin nhắn nhanh + Nút bấm đặc quyền **"✨ Tặng Tinh Tú"** (`+10`, `+20`, `+50`).

### 🔹 PHASE 3: Bong Bóng Chat Nổi Của Người Dùng (Floating Cosmic Support Bubble)
- [ ] Tạo Component `frontend/src/components/SupportChatWidget.jsx`:
  - Nút bong bóng nổi tròn ở góc dưới bên phải với biểu tượng Bậc Thầy Tarot (`Sparkles` / `MessageCircle`).
  - Chấm đỏ thông báo khi Admin đã phản hồi tin nhắn mới.
- [ ] Cửa sổ Chat Popup huyền ảo:
  - Header: *"Bậc Thầy Tarot & Quản Trị Viên"* + Trạng thái *"Đang trực tuyến"*.
  - Tin nhắn chào mừng tự động gợi ý các câu hỏi thường gặp (Rút bài, Cung hoàng đạo, Nạp tinh tú).
  - Tự động cuộn xuống tin nhắn mới nhất.
  - Hiệu ứng âm thanh tinh tế nhẹ nhàng khi tin nhắn gửi/nhận thành công.

### 🔹 PHASE 4: Tích Hợp Đồng Bộ & Tối Ưu Realtime
- [ ] Cơ chế tự động làm mới / đồng bộ tin nhắn (Smart Polling mỗi 4-6 giây khi cửa sổ chat đang mở).
- [ ] Tích hợp thông báo badge đỏ trên Navbar khi có tin nhắn hỗ trợ mới chưa đọc.
- [ ] Build kiểm tra toàn diện cả Frontend & Backend.

---

## 4. Tiêu Chí Hoàn Thành (Definition of Done)
1. User có thể mở bong bóng chat ở bất kỳ trang nào và gửi tin nhắn đến Admin.
2. Admin mở Tab Hỗ Trợ trong `/admin`, thấy danh sách tin nhắn mới và trả lời mượt mà.
3. Khi Admin tặng Tinh Tú trong chat, tài khoản của User được cộng điểm ngay lập tức.
4. Giao diện sang trọng, không giật lag, hiển thị thời gian gửi rõ ràng theo giờ Việt Nam.
