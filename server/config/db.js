/**
 * Cấu hình kết nối MySQL với Sequelize
 * Đọc thông tin từ file .env
 */
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Tạo instance Sequelize kết nối MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'cd2',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '123456',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    timezone: '+07:00', // Múi giờ Việt Nam
    define: {
      timestamps: true,    // Tự động thêm createdAt, updatedAt
      underscored: true,   // Dùng snake_case cho tên cột (created_at thay vì createdAt)
    },
    pool: {
      max: 10,    // Số kết nối tối đa
      min: 0,
      acquire: 30000, // Thời gian chờ kết nối (ms)
      idle: 10000,    // Thời gian idle trước khi đóng kết nối (ms)
    },
  }
);

// Hàm test kết nối database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối MySQL thành công!');
  } catch (error) {
    console.error('❌ Không thể kết nối MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
