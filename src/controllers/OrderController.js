const orderService = require("../services/OrderServices");

/**
 * Tạo đơn hàng mới
 */
const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json({
      status: "OK",
      message: "Đặt hàng thành công",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

/**
 * Tạo đơn hàng từ giỏ hàng
 */
const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;
    const order = await orderService.createOrderFromCart(
      userId,
      shippingAddress,
      paymentMethod,
    );
    res.status(201).json({
      status: "OK",
      message: "Đặt hàng từ giỏ hàng thành công",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

/**
 * Lấy tất cả đơn hàng (Admin)
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json({
      status: "OK",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERR",
      message: error.message,
    });
  }
};

/**
 * Lấy đơn hàng của user hiện tại
 */
const getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUser(req.user.id);
    res.json({
      status: "OK",
      data: orders,
    });
  } catch (error) {
    res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

/**
 * Lấy đơn hàng theo userId
 */
const getOrdersByUser = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUser(req.params.userId);
    res.json({
      status: "OK",
      data: orders,
    });
  } catch (error) {
    res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

/**
 * Cập nhật trạng thái đơn hàng (Admin)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status,
    );
    res.json({
      status: "OK",
      message: "Cập nhật trạng thái thành công",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

/**
 * Xóa đơn hàng (Admin)
 */
const deleteOrder = async (req, res) => {
  try {
    const result = await orderService.deleteOrder(req.params.id);
    res.json({
      status: "OK",
      message: result.message,
    });
  } catch (error) {
    res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  getMyOrders,
  updateOrderStatus,
  deleteOrder,
  createOrderFromCart,
};
