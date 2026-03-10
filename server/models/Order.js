/**
 * Model Order - Đơn hàng
 * Bảng: orders
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'shipping', 'delivered', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false,
  },
  shipping_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  shipping_phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  shipping_address: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true,
});

module.exports = Order;
