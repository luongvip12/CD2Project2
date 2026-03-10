/**
 * File index cho Models
 * Export tất cả models và thiết lập associations
 */
const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const { sequelize } = require('../config/db');

// ============================================
// Thiết lập quan hệ giữa các bảng
// ============================================

// Category <-> Product (1-N)
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// User <-> Order (1-N)
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Order <-> OrderItem (1-N)
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Product <-> OrderItem (1-N)
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// ============================================
// Sync database - Tự động tạo bảng
// ============================================
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Đồng bộ database thành công!');
  } catch (error) {
    console.error('❌ Lỗi đồng bộ database:', error.message);
    throw error;
  }
};

module.exports = {
  User,
  Product,
  Category,
  Order,
  OrderItem,
  sequelize,
  syncDatabase,
};
