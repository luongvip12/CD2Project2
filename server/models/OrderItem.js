/**
 * Model OrderItem - Chi tiết đơn hàng
 * Bảng: order_items
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Lưu tên SP tại thời điểm đặt, phòng SP bị sửa/xoá',
  },
  product_image: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: 'Giá tại thời điểm đặt hàng',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: { args: [1], msg: 'Số lượng tối thiểu là 1' },
    },
  },
}, {
  tableName: 'order_items',
  timestamps: true,
  underscored: true,
});

module.exports = OrderItem;
