const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (userId, productId, qty = 1) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Không tìm thấy sản phẩm.");
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [{ productId, qty }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingItem) {
      existingItem.qty += qty;
    } else {
      cart.items.push({ productId, qty });
    }

    await cart.save();
  }

  return await cart.populate("items.productId", "name price salePrice image stock");
};

const getCartByUser = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate("items.productId", "name price salePrice image stock");
  return cart || { userId, items: [] };
};

const updateCartItem = async (userId, productId, qty) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Không tìm thấy giỏ hàng.");

  const item = cart.items.find(
    (i) => i.productId.toString() === productId.toString()
  );
  if (!item) throw new Error("Sản phẩm không tồn tại trong giỏ.");

  if (qty <= 0) {
    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId.toString()
    );
  } else {
    item.qty = qty;
  }

  await cart.save();
  return await cart.populate("items.productId", "name price salePrice image stock");
};

const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Không tìm thấy giỏ hàng.");

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  await cart.save();
  return await cart.populate("items.productId", "name price salePrice image stock");
};

const clearCart = async (userId) => {
  const cart = await Cart.findOneAndDelete({ userId });
  return cart;
};

module.exports = {
  addToCart,
  getCartByUser,
  updateCartItem,
  removeFromCart,
  clearCart,
};
