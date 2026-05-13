const ReviewService = require("../services/ReviewServices");
const { getImageUrls } = require("../middleware/uploadMiddleware");

// Người dùng tạo đánh giá
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;
    const images = getImageUrls(req.files);

    const review = await ReviewService.createReview(
      productId,
      userId,
      rating,
      comment,
      images
    );

    res.status(201).json({
      status: "OK",
      message: "Đánh giá của bạn đang chờ duyệt",
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Lấy tất cả đánh giá của sản phẩm
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ReviewService.getProductReviews(productId, "approved");

    res.json({
      status: "OK",
      data: reviews,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Lấy rating trung bình của sản phẩm
const getProductRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const rating = await ReviewService.getProductRating(productId);

    res.json({
      status: "OK",
      data: rating,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Admin: Lấy tất cả đánh giá
const getAllReviews = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const reviews = await ReviewService.getAllReviews(filter);

    res.json({
      status: "OK",
      data: reviews,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Admin: Duyệt/từ chối đánh giá
const updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body;

    const review = await ReviewService.updateReviewStatus(reviewId, status);

    res.json({
      status: "OK",
      message: "Cập nhật trạng thái đánh giá thành công",
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Admin: Phản hồi đánh giá
const addAdminReply = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reply } = req.body;

    const review = await ReviewService.addAdminReply(reviewId, reply);

    res.json({
      status: "OK",
      message: "Phản hồi thành công",
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Admin: Xoá đánh giá
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await ReviewService.deleteReview(reviewId);

    res.json({
      status: "OK",
      message: "Xoá đánh giá thành công",
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getProductRating,
  getAllReviews,
  updateReviewStatus,
  addAdminReply,
  deleteReview,
};
