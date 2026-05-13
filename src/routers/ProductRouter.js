const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const { authMiddleware, Admin } = require("../middleware/authMiddlware");
const { validateBody } = require("../middleware/validateMiddleware");
const { uploadProductImages, handleMulterError } = require("../middleware/uploadMiddleware");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/productValidator");

// Public routes
router.get("/", productController.getAllProduct);
router.get("/search", productController.searchAndFilterProducts);
router.get("/:id", productController.getProductById);

// Admin routes
router.post(
  "/",
  authMiddleware,
  Admin,
  uploadProductImages,
  handleMulterError,
  validateBody(createProductSchema),
  productController.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  Admin,
  uploadProductImages,
  handleMulterError,
  validateBody(updateProductSchema),
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  Admin,
  productController.deleteProduct
);

router.delete(
  "/:id/image/:index",
  authMiddleware,
  Admin,
  productController.deleteProductImage
);

module.exports = router;
