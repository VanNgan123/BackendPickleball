const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const { authMiddleware, Admin } = require("../middleware/authMiddleware");
const { validateBody, validateParams } = require("../middleware/validateMiddleware");
const { uploadProductImages, handleMulterError } = require("../middleware/uploadMiddleware");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/productValidator");
const {
  mongoIdSchema,
  mongoIdWithIndexSchema,
} = require("../validators/commonValidator");

// Public routes
router.get("/", productController.getAllProduct);
router.get("/search", productController.searchAndFilterProducts);
router.get("/:id", validateParams(mongoIdSchema), productController.getProductById);

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
  validateParams(mongoIdSchema),
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  Admin,
  validateParams(mongoIdSchema),
  productController.deleteProduct
);

router.delete(
  "/:id/image/:index",
  authMiddleware,
  Admin,
  validateParams(mongoIdWithIndexSchema),
  productController.deleteProductImage
);

module.exports = router;
