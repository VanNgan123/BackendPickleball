const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { authMiddleware } = require("../middleware/authMiddlware");
const { authLimiter } = require("../middleware/rateLimiter");
const { validateBody } = require("../middleware/validateMiddleware");
const { uploadUserAvatar, handleMulterError } = require("../middleware/uploadMiddleware");
const {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
} = require("../validators/userValidator");

router.post(
    "/register",
    authLimiter,
    validateBody(registerSchema),
    userController.createUser
);

router.post(
    "/login",
    authLimiter,
    validateBody(loginSchema),
    userController.loginUser
);

router.post(
    "/refresh-token",
    validateBody(refreshTokenSchema),
    userController.refreshToken
);

router.get("/profile", authMiddleware, userController.getProfile);

// Upload avatar
router.put(
    "/avatar",
    authMiddleware,
    uploadUserAvatar,
    handleMulterError,
    userController.updateAvatar
);

// Cập nhật profile
router.put(
    "/profile",
    authMiddleware,
    userController.updateProfile
);

module.exports = router;