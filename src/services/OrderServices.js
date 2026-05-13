const Order = require("../models/Order");
const Product = require("../models/Product");
const CartService = require("./CartService");

/**
 * Tạo đơn hàng mới
 * - Kiểm tra stock đơn giản trước khi tạo
 * - Trừ stock sau khi tạo order thành công
 */
const createOrder = async (data) => {
  const { userId, items, shippingAddress, paymentMethod } = data;

  if (!userId || !items || items.length === 0) {
    throw new Error("Thiếu thông tin đơn hàng hoặc danh sách sản phẩm.");
  }

  let total = 0;
  const orderItems = [];

  // Kiểm tra stock và tính tổng tiền
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Không tìm thấy sản phẩm ID: ${item.productId}`);
    }

    // Kiểm tra còn đủ hàng không
    if (product.stock < item.qty) {
      throw new Error(
        `Sản phẩm "${product.name}" không đủ số lượng. Còn lại: ${product.stock}`
      );
    }

    // Tính giá (ưu tiên salePrice nếu có)
    const price = product.salePrice || product.price;
    total += price * item.qty;

    orderItems.push({
      productId: item.productId,
      qty: item.qty,
      price: price,
    });
  }

  // Tạo đơn hàng
  const order = await Order.create({
    userId,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || "COD",
    total,
    status: "Pending",
  });

  // Trừ stock sau khi tạo order thành công
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.qty },
    });
  }

  return order;
};

/**
 * Tạo đơn hàng từ giỏ hàng
 */
const createOrderFromCart = async (userId, shippingAddress, paymentMethod = "COD") => {
  const cart = await CartService.getCartByUser(userId);
  if (!cart || cart.items.length === 0) {
    throw new Error("Giỏ hàng trống.");
  }

  let total = 0;
  const orderItems = [];

  // Kiểm tra stock và tính tổng
  for (const item of cart.items) {
    const productId = item.productId._id || item.productId;
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error(`Không tìm thấy sản phẩm`);
    }

    if (product.stock < item.qty) {
      throw new Error(
        `Sản phẩm "${product.name}" không đủ số lượng. Còn lại: ${product.stock}`
      );
    }

    const price = product.salePrice || product.price;
    total += price * item.qty;

    orderItems.push({
      productId: product._id,
      qty: item.qty,
      price: price,
    });
  }

  // Tạo đơn hàng
  const order = await Order.create({
    userId,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    total,
    status: "Pending",
  });

  // Trừ stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.qty },
    });
  }

  // Xóa giỏ hàng
  await CartService.clearCart(userId);

  return order;
};

/**
 * Lấy tất cả đơn hàng (Admin)
 */
const getAllOrders = async () => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .populate("items.productId", "name price image")
    .sort({ createdAt: -1 });
  return orders;
};

/**
 * Lấy đơn hàng theo user
 */
const getOrdersByUser = async (userId) => {
  const orders = await Order.find({ userId })
    .populate("items.productId", "name price image")
    .sort({ createdAt: -1 });
  return orders;
};

/**
 * Cập nhật trạng thái đơn hàng
 * - Hoàn lại stock nếu hủy đơn
 */
const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Không tìm thấy đơn hàng.");

  const oldStatus = order.status;

  // Nếu hủy đơn và trước đó chưa hủy -> hoàn lại stock
  if (status === "Cancelled" && oldStatus !== "Cancelled") {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.qty },
      });
    }
  }

  order.status = status;
  await order.save();
  return order;
};

/**
 * Xóa đơn hàng
 */
const deleteOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Không tìm thấy đơn hàng để xóa.");

  // Nếu đơn pending -> hoàn lại stock
  if (order.status === "Pending") {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.qty },
      });
    }
  }

  await Order.findByIdAndDelete(orderId);
  return { message: "Đã xóa đơn hàng thành công" };
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  updateOrderStatus,
  deleteOrder,
  createOrderFromCart,
};
