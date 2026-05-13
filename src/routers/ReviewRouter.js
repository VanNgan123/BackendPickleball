const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");
const { authMiddleware, Admin } = require("../middleware/authMiddlware");
const { uploadReviewImages, handleMulterError } = require("../middleware/uploadMiddleware");

// User routes
router.post(
  "/",
  authMiddleware,
  uploadReviewImages,
  handleMulterError,
  ReviewController.createReview
);
router.get("/product/:productId", ReviewController.getProductReviews);
router.get("/rating/:productId", ReviewController.getProductRating);

// Admin routes
router.get("/", authMiddleware, Admin, ReviewController.getAllReviews);
router.put("/:reviewId/status", authMiddleware, Admin, ReviewController.updateReviewStatus);
router.put("/:reviewId/reply", authMiddleware, Admin, ReviewController.addAdminReply);
router.delete("/:reviewId", authMiddleware, Admin, ReviewController.deleteReview);

module.exports = router;
