/**
 * Controller Dashboard
 * Thống kê tổng quan cho Admin
 */
const { User, Product, Category, Order } = require('../models');

/**
 * GET /api/dashboard/stats
 * Lấy thống kê tổng quan (Admin only)
 */
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalCategories, totalOrders] = await Promise.all([
      User.count(),
      Product.count(),
      Category.count(),
      Order.count(),
    ]);

    // Đếm đơn hàng theo trạng thái
    const [pendingOrders, confirmedOrders, shippingOrders, deliveredOrders, cancelledOrders] = await Promise.all([
      Order.count({ where: { status: 'pending' } }),
      Order.count({ where: { status: 'confirmed' } }),
      Order.count({ where: { status: 'shipping' } }),
      Order.count({ where: { status: 'delivered' } }),
      Order.count({ where: { status: 'cancelled' } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        ordersByStatus: {
          pending: pendingOrders,
          confirmed: confirmedOrders,
          shipping: shippingOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê.',
    });
  }
};

module.exports = { getStats };
