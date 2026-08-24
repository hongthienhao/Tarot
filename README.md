# Tarot Mystic Space - Không Gian Huyền Bí

Ứng dụng Tarot trực tuyến mang lại cảm giác tĩnh lặng và sâu sắc, giúp bạn khám phá bản thân thông qua những biểu tượng cổ xưa. Dự án được xây dựng với kiến trúc hiện đại, tách biệt giữa Backend (Node.js) và Frontend (React).

---

## 🚀 Công Nghệ Sử Dụng

### Backend
- **Node.js & Express**: Framework mạnh mẽ cho ứng dụng web.
- **Prisma ORM**: Quản lý cơ sở dữ liệu PostgreSQL một cách an toàn và dễ dàng.
- **PostgreSQL**: Cơ sở dữ liệu quan hệ ổn định.
- **ESM (ECMAScript Modules)**: Sử dụng cú pháp import/export hiện đại.

### Frontend
- **React 19 & Vite**: Framework frontend và công cụ build siêu nhanh.
- **TailwindCSS v4**: Thiết kế giao diện theo phong cách "Cinematic Healing" với bảng màu tối sang trọng.
- **Framer Motion**: Tạo các hiệu ứng chuyển động mượt mà, cao cấp.
- **Lucide React**: Bộ icon tinh tế.
- **Axios**: Kết nối và gọi API từ Backend.

---

## 🛠 Cài Đặt Dự Án

### 1. Yêu cầu hệ thống
- Node.js (phiên bản 18 trở lên)
- Docker & Docker Compose (để chạy PostgreSQL)

### 2. Thiết lập Backend
Từ thư mục gốc của dự án:
```bash
# Cài đặt dependencies
npm install

# Sao chép file cấu hình môi trường
cp .env.example .env # (Nếu chưa có, hãy tạo file .env với thông số của bạn)

# Khởi động database bằng Docker
docker-compose up -d

# Chạy migration để tạo bảng
npx prisma migrate dev

# Seed dữ liệu (tạo 78 lá bài mẫu)
npm run seed:cards
```

### 3. Thiết lập Frontend
```bash
cd frontend

# Cài đặt dependencies
npm install
```

---

## 🏃 Chạy Ứng Dụng

### Chạy Backend (Development Mode)
Từ thư mục gốc:
```bash
npm run dev
```
Backend sẽ chạy tại: `http://localhost:3000`

### Chạy Frontend
```bash
cd frontend
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:5173` (hoặc cổng hiển thị trong terminal)

---

## 📜 Các Chức Năng Chính

- **Giao diện Landing Page**: Không gian huyền bí với hiệu ứng Cinematic.
- **Spread Selector**: Cho phép người dùng chọn kiểu trải bài (1 lá, 3 lá, hoặc 5 lá).
- **Hệ thống rút bài**: Logic rút bài ngẫu nhiên, không trùng lặp, hỗ trợ cả trạng thái Xuôi (Upright) và Ngược (Reversed).
- **Dữ liệu 78 lá bài**: Đầy đủ tên, hình ảnh và ý nghĩa cho từng vị trí.

---

## 🐳 Chạy Bằng Docker (Nhanh nhất)

Nếu bạn đã cài đặt Docker và Docker Compose, bạn có thể khởi động toàn bộ hệ thống chỉ với một câu lệnh duy nhất:

```bash
docker-compose up --build -d
```

Lệnh này sẽ tự động:
1. Khởi tạo Database PostgreSQL.
2. Build và chạy Backend tại: [http://localhost:3001](http://localhost:3001)
3. Build và chạy Frontend tại: [http://localhost:80](http://localhost:80)
4. Tài liệu API (Swagger): [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

---

## 🗄 Truy Cập Database

Bạn có thể kết nối với Database PostgreSQL của dự án bằng các thông số sau:

- **Host**: `localhost`
- **Port**: `5433` (Đã đổi để tránh xung đột với cổng 5432 mặc định)
- **User**: `tarot_user`
- **Password**: `tarot_password`
- **Database**: `tarot_db`

### Công cụ gợi ý:
- **Prisma Studio** (Giao diện web của Prisma):
  ```bash
  npx prisma studio
  ```
- Hoặc sử dụng các phần mềm như **TablePlus**, **DBeaver**, **Navicat**.

---

## 📡 API Endpoints Quan Trọng

- `GET /api/v1/health`: Kiểm tra trạng thái hệ thống.
- `POST /api/v1/draw`: Rút bài Tarot (truyền vào số lượng lá bài).
- `GET /api-docs`: Tài liệu API đầy đủ (Swagger UI).

---

## 🎨 Design Note
Giao diện sử dụng bảng màu **Mystic Purple** (`#1a0b2e`) và **Mystic Wine** (`#4a0e0e`) kết hợp với các đường nét vàng đồng (**Gold**) để tạo cảm giác sang trọng và huyền bí.
