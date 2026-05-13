const Review = require("../models/Review");
const Product = require("../models/Product");

// Tạo đánh giá
const createReview = async (productId, userId, rating, comment, images = []) => {
  if (!productId || !userId || !rating || !comment) {
    throw new Error("Thiếu thông tin đánh giá (productId, userId, rating, comment)");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating phải từ 1 đến 5");
  }

  const product = await Product.findById(productId);
  if (!product) throw new Error("Sản phẩm không tồn tại");

  // Kiểm tra user đã đánh giá sản phẩm này chưa
  const existingReview = await Review.findOne({ productId, userId });
  if (existingReview) {
    throw new Error("Bạn đã đánh giá sản phẩm này rồi");
  }

  const review = await Review.create({
    productId,
    userId,
    rating,
    comment,
    images,
  });

  return review;
};

// Lấy tất cả đánh giá của 1 sản phẩm
const getProductReviews = async (productId, status = "approved") => {
  const reviews = await Review.find({ productId, status })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  return reviews;
};

// Lấy tất cả đánh giá (admin)
const getAllReviews = async (filter = {}) => {
  const reviews = await Review.find(filter)
    .populate("productId", "name")
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  return reviews;
};

// Duyệt/từ chối đánh giá
const updateReviewStatus = async (reviewId, status) => {
  if (!["approved", "rejected", "pending"].includes(status)) {
    throw new Error("Status không hợp lệ");
  }

  const review = await Review.findByIdAndUpdate(
    reviewId,
    { status },
    { new: true }
  );

  if (!review) throw new Error("Đánh giá không tồn tại");
  return review;
};

// Admin phản hồi đánh giá
const addAdminReply = async (reviewId, replyText) => {
  const review = await Review.findByIdAndUpdate(
    reviewId,
    {
      "adminReply.text": replyText,
      "adminReply.replyAt": new Date(),
    },
    { new: true }
  );

  if (!review) throw new Error("Đánh giá không tồn tại");
  return review;
};

// Xoá đánh giá
const deleteReview = async (reviewId) => {
  const review = await Review.findByIdAndDelete(reviewId);
  if (!review) throw new Error("Đánh giá không tồn tại");
  return review;
};

// Tính rating trung bình của sản phẩm
const getProductRating = async (productId) => {
  const result = await Review.aggregate([
    { $match: { productId: require("mongoose").Types.ObjectId(productId), status: "approved" } },
    {
      $group: {
        _id: "$productId",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  return result[0] || { avgRating: 0, totalReviews: 0 };
};

module.exports = {
  createReview,
  getProductReviews,
  getAllReviews,
  updateReviewStatus,
  addAdminReply,
  deleteReview,
  getProductRating,
};
