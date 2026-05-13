const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// Thêm sản phẩm vào wishlist
const addToWishlist = async (userId, productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Sản phẩm không tồn tại");

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      userId,
      products: [productId],
    });
  } else {
    // Kiểm tra sản phẩm đã trong wishlist chưa
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
  }

  return await wishlist.populate("products", "name price salePrice image");
};

// Lấy wishlist của user
const getWishlist = async (userId) => {
  const wishlist = await Wishlist.findOne({ userId }).populate(
    "products",
    "name price salePrice image stock"
  );

  return wishlist || { userId, products: [] };
};

// Xoá sản phẩm khỏi wishlist
const removeFromWishlist = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) throw new Error("Wishlist không tồn tại");

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId.toString()
  );

  await wishlist.save();
  return await wishlist.populate("products", "name price salePrice image");
};

// Xoá toàn bộ wishlist
const clearWishlist = async (userId) => {
  const wishlist = await Wishlist.findOneAndDelete({ userId });
  return wishlist;
};

// Kiểm tra sản phẩm có trong wishlist không
const isInWishlist = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({
    userId,
    products: productId,
  });

  return !!wishlist;
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
  isInWishlist,
};
