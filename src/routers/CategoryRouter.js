const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");
const { authMiddleware, Admin } = require("../middleware/authMiddlware");
const { uploadCategoryImage, handleMulterError } = require("../middleware/uploadMiddleware");

// Public routes
router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getOne);

// Admin routes - có upload ảnh
router.post(
  "/",
  authMiddleware,
  Admin,
  uploadCategoryImage,
  handleMulterError,
  categoryController.create
);

router.put(
  "/:id",
  authMiddleware,
  Admin,
  uploadCategoryImage,
  handleMulterError,
  categoryController.update
);

module.exports = router;