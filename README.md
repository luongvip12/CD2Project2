# CD2 Project - Full-Stack Web Application

> **Node.js + Express | MySQL + Sequelize | React | JWT Authentication**

## 📁 Cấu trúc thư mục

```
CD2Project2/
├── server/                      # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js                # Cấu hình kết nối MySQL
│   ├── controllers/
│   │   ├── authController.js    # Xử lý đăng ký, đăng nhập
│   │   ├── productController.js # CRUD sản phẩm
│   │   └── dashboardController.js # Thống kê dashboard
│   ├── middleware/
│   │   ├── auth.js              # JWT verify + role check
│   │   └── validate.js          # Validate dữ liệu đầu vào
│   ├── models/
│   │   ├── User.js              # Model User (bcrypt hash)
│   │   ├── Product.js           # Model Product
│   │   └── index.js             # Export & sync models
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth/*
│   │   ├── productRoutes.js     # /api/products/*
│   │   └── dashboardRoutes.js   # /api/dashboard/*
│   ├── seeders/
│   │   └── adminSeed.js         # Tạo tài khoản admin
│   ├── server.js                # Entry point
│   ├── .env                     # Cấu hình DB (chỉnh lại)
│   └── .env.example             # Template cấu hình
│
├── components/
│   └── ProtectedRoute.tsx       # Bảo vệ route
├── contexts/
│   └── AuthContext.tsx           # Quản lý auth state
├── services/
│   └── api.ts                   # Axios + JWT interceptor
├── pages/
│   ├── Login.tsx                # Trang đăng nhập
│   ├── Register.tsx             # Trang đăng ký
│   ├── Shop.tsx                 # Cửa hàng (fetch từ API)
│   └── admin/
│       ├── Dashboard.tsx        # Admin Dashboard
│       └── ProductManagement.tsx # CRUD sản phẩm
├── layouts/
│   └── MasterLayout.tsx         # Layout chính (auth-aware)
├── App.tsx                      # Router + AuthProvider
├── vite.config.ts               # Vite + proxy /api
└── package.json
```

## 🚀 Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- **Node.js** >= 18
- **MySQL** >= 8.0
- **npm** >= 9

### 2. Tạo Database MySQL

```sql
CREATE DATABASE cd2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Cấu hình Backend

```bash
# Mở file server/.env và chỉnh thông tin kết nối DB
DB_HOST=localhost
DB_PORT=3306
DB_USER=root        # ← username MySQL của bạn
DB_PASS=            # ← password MySQL của bạn
DB_NAME=cd2
JWT_SECRET=cd2_super_secret_key_2025
```

### 4. Cài đặt dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install
```

### 5. Seed tài khoản Admin

```bash
cd server
npm run seed
```

Kết quả:
```
✅ Tạo tài khoản Admin thành công!
   Email:    admin@example.com
   Password: admin123
```

### 6. Chạy dự án

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
→ Server chạy tại: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
→ App chạy tại: `http://localhost:3000`

## 🔑 Authentication

| Tài khoản | Email | Password | Role |
|-----------|-------|----------|------|
| Admin | admin@example.com | admin123 | admin |

## 📡 API Endpoints

### Auth
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/register` | Đăng ký | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| GET | `/api/auth/me` | Lấy user hiện tại | ✅ JWT |

### Products
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/products` | Lấy tất cả SP | ❌ |
| GET | `/api/products/:id` | Lấy chi tiết SP | ❌ |
| POST | `/api/products` | Thêm SP | ✅ Admin |
| PUT | `/api/products/:id` | Sửa SP | ✅ Admin |
| DELETE | `/api/products/:id` | Xoá SP | ✅ Admin |

### Dashboard
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/dashboard/stats` | Thống kê | ✅ Admin |

## 📮 Postman Examples

### 1. Đăng ký
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "password": "123456"
}
```

### 2. Đăng nhập
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "data": {
    "user": { "id": 1, "name": "Admin", "email": "admin@example.com", "role": "admin" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 3. Thêm sản phẩm (Admin)
```
POST http://localhost:5000/api/products
Content-Type: application/json
Authorization: Bearer <token_từ_login>

{
  "name": "Laptop Gaming ASUS",
  "description": "Laptop gaming cao cấp",
  "price": 25000000,
  "stock": 10
}
```

### 4. Cập nhật sản phẩm (Admin)
```
PUT http://localhost:5000/api/products/1
Content-Type: application/json
Authorization: Bearer <token_từ_login>

{
  "price": 22000000,
  "stock": 15
}
```

### 5. Xoá sản phẩm (Admin)
```
DELETE http://localhost:5000/api/products/1
Authorization: Bearer <token_từ_login>
```

### 6. Lấy thống kê Dashboard (Admin)
```
GET http://localhost:5000/api/dashboard/stats
Authorization: Bearer <token_từ_login>
```

## 🛡️ Bảo mật
- Password được hash bằng **bcrypt** (10 rounds)
- Authentication bằng **JWT** (hết hạn 24h)
- Route admin được bảo vệ bằng middleware `verifyToken` + `isAdmin`
- Validate dữ liệu đầu vào bằng **express-validator**
- CORS được cấu hình chỉ cho phép frontend domain
