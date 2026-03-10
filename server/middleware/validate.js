/**
 * Middleware validate dữ liệu đầu vào
 * Sử dụng express-validator
 */
const { body, validationResult } = require('express-validator');

/**
 * Xử lý kết quả validation
 * Trả về lỗi 400 nếu dữ liệu không hợp lệ
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// ============================================
// Validation rules cho Auth
// ============================================

const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Tên không được để trống')
    .isLength({ min: 2, max: 100 }).withMessage('Tên phải từ 2 đến 100 ký tự'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email không được để trống')
    .isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Mật khẩu không được để trống')
    .isLength({ min: 6 }).withMessage('Mật khẩu phải từ 6 ký tự trở lên'),
  handleValidation,
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email không được để trống')
    .isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Mật khẩu không được để trống'),
  handleValidation,
];

// ============================================
// Validation rules cho Product
// ============================================

const productRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Tên sản phẩm không được để trống')
    .isLength({ min: 2, max: 200 }).withMessage('Tên sản phẩm phải từ 2 đến 200 ký tự'),
  body('description')
    .optional()
    .trim(),
  body('price')
    .notEmpty().withMessage('Giá không được để trống')
    .isFloat({ min: 0 }).withMessage('Giá phải là số dương'),
  body('stock')
    .notEmpty().withMessage('Số lượng tồn kho không được để trống')
    .isInt({ min: 0 }).withMessage('Số lượng tồn kho phải là số nguyên không âm'),
  handleValidation,
];

const productUpdateRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Tên sản phẩm phải từ 2 đến 200 ký tự'),
  body('description')
    .optional()
    .trim(),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Giá phải là số dương'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Số lượng tồn kho phải là số nguyên không âm'),
  handleValidation,
];

module.exports = {
  registerRules,
  loginRules,
  productRules,
  productUpdateRules,
};
