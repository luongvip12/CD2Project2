/**
 * Seed script: Tạo tài khoản Admin mặc định
 * Chạy: npm run seed (từ thư mục server/)
 */
require('dotenv').config();
const { User, syncDatabase } = require('../models');
const { connectDB } = require('../config/db');

const seedAdmin = async () => {
  try {
    // Kết nối database
    await connectDB();
    await syncDatabase();

    // Kiểm tra admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
    if (existingAdmin) {
      console.log('⚠️  Admin đã tồn tại, bỏ qua seed.');
      process.exit(0);
    }

    // Tạo tài khoản admin
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('✅ Tạo tài khoản Admin thành công!');
    console.log('   Email:    admin@example.com');
    console.log('   Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi seed admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
