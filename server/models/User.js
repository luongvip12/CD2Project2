/**
 * Model User - Quản lý thông tin người dùng
 * Bảng: users
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Tên không được để trống' },
      len: { args: [2, 100], msg: 'Tên phải từ 2 đến 100 ký tự' },
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: { msg: 'Email đã được sử dụng' },
    validate: {
      isEmail: { msg: 'Email không hợp lệ' },
      notEmpty: { msg: 'Email không được để trống' },
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Mật khẩu không được để trống' },
      len: { args: [6, 255], msg: 'Mật khẩu phải từ 6 ký tự trở lên' },
    },
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: true,       // Tự động thêm created_at, updated_at
  underscored: true,      // Dùng snake_case
  hooks: {
    // Hash mật khẩu trước khi lưu vào DB
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    // Hash mật khẩu khi update
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

/**
 * So sánh mật khẩu nhập vào với mật khẩu đã hash
 * @param {string} candidatePassword - Mật khẩu người dùng nhập
 * @returns {boolean}
 */
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Loại bỏ password khi trả JSON
 */
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;
