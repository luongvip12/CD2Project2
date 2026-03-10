/**
 * Model Category - Danh mục sản phẩm
 * Bảng: categories
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: { msg: 'Tên danh mục đã tồn tại' },
    validate: {
      notEmpty: { msg: 'Tên danh mục không được để trống' },
      len: { args: [2, 100], msg: 'Tên danh mục phải từ 2 đến 100 ký tự' },
    },
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: '',
  },
}, {
  tableName: 'categories',
  timestamps: true,
  underscored: true,
});

module.exports = Category;
