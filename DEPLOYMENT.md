# HƯỚNG DẪN TRIỂN KHAI HỆ THỐNG (DEPLOYMENT & LAUNCH GUIDE)
## Dự Án Tarot Online - Ngày 14: Lan Tỏa Giá Trị

Tài liệu này hướng dẫn chi tiết từng bước để đưa ứng dụng **Tarot Online (Chronicles of Fate)** từ môi trường phát triển cục bộ lên internet, sử dụng các nền tảng đám mây phổ biến, miễn phí và tối ưu nhất hiện nay: **Vercel** cho Frontend (React/Vite) và **Render** cho Backend (Node.js/Express/Prisma/PostgreSQL).

---

## 🗺️ Mô Hình Kiến Trúc Triển Khai (Architecture)

```mermaid
graph LR
    User([Người dùng]) --> |HTTPS| FrontendApp[Vercel Frontend - React SPA]
    FrontendApp --> |API Calls - Secure CORS| BackendAPI[Render Backend - Express]
    BackendAPI --> |Prisma Client| Database[(Render PostgreSQL)]
    BackendAPI --> |Secure Stream| GeminiAPI[Google AI Studio - Gemini 1.5 Pro/Flash]
```

---

## 🗄️ Bước 1: Triển Khai Cơ Sở Dữ Liệu (Render PostgreSQL)

Trước tiên, bạn cần có một cơ sở dữ liệu PostgreSQL trực tuyến để lưu trữ thông tin người dùng và nhật ký trải bài.

1. Truy cập [Render Dashboard](https://dashboard.render.com/) và đăng nhập.
2. Nhấn **New +** và chọn **PostgreSQL**.
3. Cấu hình các thông số:
   - **Name**: `tarot-db-production`
   - **Database**: `tarot_db`
   - **User**: `tarot_admin`
   - **Region**: Chọn khu vực gần bạn nhất (ví dụ: `Singapore` hoặc `Oregon`).
4. Nhấn **Create Database**.
5. Sau khi DB khởi tạo xong, hãy copy giá trị **Internal Database URL** hoặc **External Database URL** để cấu hình cho Backend ở bước tiếp theo.
   - *Ví dụ dạng*: `postgresql://tarot_admin:password@dpg-xxxx-a.singapore-postgres.render.com/tarot_db`

---

## 🚀 Bước 2: Triển Khai Backend (Render Web Service)

Render hỗ trợ triển khai mã nguồn Node.js trực tiếp hoặc thông qua Docker Container (dự án đã có sẵn `Dockerfile`). 

### Lựa chọn A: Triển khai Native Node.js Web Service (Khuyên dùng - Tiết kiệm tài nguyên)

1. Nhấn **New +** trên Render Dashboard và chọn **Web Service**.
2. Kết nối với tài khoản GitHub của bạn và chọn Repository chứa dự án.
3. Cấu hình thông tin cơ bản:
   - **Name**: `tarot-backend-service`
   - **Region**: Cùng region với Database (để tối ưu độ trễ).
   - **Branch**: `main` hoặc `master`.
   - **Root Directory**: Để trống (vì package.json nằm ở thư mục gốc).
   - **Runtime**: `Node`
4. Cấu hình Build & Start:
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npx prisma db push --accept-data-loss && npm run seed:cards && node src/server.js`
     > *Chú ý*: Lệnh `seed:cards` sẽ tự động đổ dữ liệu 78 lá bài Tarot cùng đường dẫn hình ảnh vào database khi server khởi động lần đầu.

### Lựa chọn B: Triển khai bằng Docker

Nếu bạn muốn chạy đồng bộ qua Docker Container:
1. Tạo **Web Service**, kết nối GitHub.
2. Phần **Runtime**, chọn **Docker** thay vì Node.
3. Render sẽ tự động đọc [Dockerfile](file:///c:/LEARN_CODE/Demo_Project/TAROT/Project/Dockerfile) ở root và build container. Hệ thống tự động chạy file [docker-entrypoint.sh](file:///c:/LEARN_CODE/Demo_Project/TAROT/Project/docker-entrypoint.sh) để đồng bộ database.

### 🔐 Cấu hình biến môi trường trên Render (Environment Variables)

Tại tab **Variables** (hoặc **Environment**) trên Render Web Service, hãy thêm các biến sau để đảm bảo bảo mật và vận hành ổn định:

| Tên biến | Giá trị khuyên dùng | Mục đích |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Bật các tối ưu hóa production và log thích hợp |
| `PORT` | `3000` | Port chạy ứng dụng (Render tự động cấp nếu trống) |
| `DATABASE_URL` | *Dán URL cơ sở dữ liệu PostgreSQL ở Bước 1* | Kết nối Prisma tới database online |
| `GEMINI_API_KEY` | *API Key lấy từ Google AI Studio* | Dùng để stream giải luận Tarot và Chat tâm giao |
| `JWT_SECRET` | *Một chuỗi ký tự ngẫu nhiên siêu bảo mật* | Ký mã hóa Token đăng nhập cho người dùng |
| `JWT_EXPIRES_IN` | `90d` | Thời hạn hiệu lực của token đăng nhập |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app,http://localhost:5173` | **Quan trọng**: Chỉ cho phép tên miền Vercel của bạn và localhost gọi API |

---

## 🎨 Bước 3: Triển Khai Frontend (Vercel)

Vercel là nền tảng hoàn hảo nhất để tối ưu hóa tốc độ tải và phân phối tài nguyên tĩnh của ứng dụng React (Vite).

1. Truy cập [Vercel Dashboard](https://vercel.com/) và đăng nhập.
2. Nhấn **Add New** -> **Project**.
3. Chọn Repository chứa mã nguồn dự án của bạn.
4. Cấu hình dự án:
   - **Project Name**: `tarot-mystic-app`
   - **Framework Preset**: **Vite** (Vercel sẽ tự nhận diện).
   - **Root Directory**: **`frontend`** 👈 *CỰC KỲ QUAN TRỌNG: Bạn phải nhấn Edit và chọn thư mục `frontend`.*
5. Cấu hình Build & Development:
   - Các lệnh Build Command (`npm run build`) và Output Directory (`dist`) giữ mặc định.
6. **Cấu hình Biến môi trường (Environment Variables)**:
   Thêm biến sau để kết nối Frontend với Backend online:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://tarot-backend-service.onrender.com/api/v1` *(Thay thế bằng URL Render Backend của bạn)*

7. Nhấn **Deploy**.
8. Vercel sẽ tự động cấu hình SPA Routing nhờ file [vercel.json](file:///c:/LEARN_CODE/Demo_Project/TAROT/Project/frontend/vercel.json) mà chúng ta đã chuẩn bị sẵn, đảm bảo tính năng tải lại trang (reload) hoạt động 100% không bao giờ gặp lỗi 404.

---

## 🔍 Bước 4: Kiểm Tra Toàn Bộ Luồng Dữ Liệu Sau Khi Triển Khai

Sau khi cả 2 nền tảng báo trạng thái **Active/Deployed**, hãy kiểm tra lại hệ thống theo danh sách sau:

1. **Kiểm tra Health Endpoint**:
   Truy cập `https://tarot-backend-service.onrender.com/api/v1/health` trên trình duyệt. Server phải trả về phản hồi JSON có dạng:
   ```json
   {
     "status": "success",
     "data": {
       "uptime": "120 seconds",
       "environment": "production"
     }
   }
   ```
2. **Kiểm tra Seeder bài Tarot**:
   Truy cập `https://tarot-backend-service.onrender.com/api/v1/cards` để đảm bảo hệ thống đã có đủ danh sách 78 lá bài và hình ảnh tĩnh được hiển thị đúng định dạng.
3. **Kiểm tra Đăng nhập & Đăng ký**:
   Mở tên miền Vercel của bạn, tiến hành đăng ký tài khoản mới và đăng nhập. Kiểm tra xem token có được lưu vào `localStorage` chính xác không.
4. **Trải nghiệm Quy trình rút bài & Stream giải luận AI**:
   - Chọn kiểu trải bài bất kỳ.
   - Tiến hành "Xào bài" -> "Rút bài" -> Xem hình ảnh và lật các lá bài.
   - Bắt đầu phiên trò chuyện tâm sâu với AI. Đảm bảo luồng chữ chạy ra mượt mà từng chữ (SSE Stream) và nội dung giải luận được lưu tự động vào **Biên niên sử (History)** ngay lập tức.
5. **Kiểm tra CORS**:
   Thử gọi API backend từ một origin lạ (không nằm trong danh sách `ALLOWED_ORIGINS`). Backend phải trả về lỗi chặn CORS `Not allowed by CORS` để bảo vệ tài nguyên của bạn.

---

## 🛠️ Hướng Dẫn Vận Hành & Bảo Trì Định Kỳ

- **Đồng bộ Schema Database**: Khi bạn có bất kỳ thay đổi nào trong file `prisma/schema.prisma` ở môi trường dev, hãy commit lên GitHub. Lệnh khởi động trên Render sẽ tự động chạy `npx prisma db push` để cập nhật bảng mà không làm mất mát dữ liệu hiện có (trừ trường hợp cấu hình xung đột nghiêm trọng).
- **Mức tiêu hao tài nguyên**: Cả Render và Vercel đều cung cấp biểu đồ giám sát tài nguyên (CPU, RAM, Băng thông). Hãy theo dõi định kỳ để nâng cấp gói dịch vụ khi lượng người dùng tìm đến sự chữa lành ngày càng đông đảo.
