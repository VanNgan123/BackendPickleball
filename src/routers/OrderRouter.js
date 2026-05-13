const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const { authMiddleware, Admin } = require("../middleware/authMiddlware");
const { validateBody } = require("../middleware/validateMiddleware");
const {
    createOrderSchema,
    createOrderFromCartSchema,
    updateOrderStatusSchema,
} = require("../validators/orderValidator");

// User routes
router.post(
    "/",
    authMiddleware,
    validateBody(createOrderSchema),
    orderController.createOrder
);

router.post(
    "/from-cart",
    authMiddleware,
    validateBody(createOrderFromCartSchema),
    orderController.createOrderFromCart
);

router.get("/my-orders", authMiddleware, orderController.getMyOrders);

router.get("/user/:userId", authMiddleware, orderController.getOrdersByUser);

// Admin routes
router.get("/", authMiddleware, Admin, orderController.getAllOrders);

router.put(
    "/:id",
    authMiddleware,
    Admin,
    validateBody(updateOrderStatusSchema),
    orderController.updateOrderStatus
);

router.delete("/:id", authMiddleware, Admin, orderController.deleteOrder);

module.exports = router;
