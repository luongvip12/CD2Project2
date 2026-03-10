/**
 * Model Product - Quản lý thông tin sản phẩm
 * Bảng: products
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Tên sản phẩm không được để trống' },
      len: { args: [2, 200], msg: 'Tên sản phẩm phải từ 2 đến 200 ký tự' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: 'Giá phải là số' },
      min: { args: [0], msg: 'Giá không được âm' },
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: { msg: 'Số lượng tồn kho phải là số nguyên' },
      min: { args: [0], msg: 'Số lượng tồn kho không được âm' },
    },
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: null,
    comment: 'Tên file ảnh sản phẩm (lưu trong uploads/products/)',
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    comment: 'ID danh mục sản phẩm',
  },
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true,
});

module.exports = Product;
