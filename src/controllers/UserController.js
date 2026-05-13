const UserService = require("../services/UserServices");
const { getImageUrl } = require("../middleware/uploadMiddleware");

/**
 * Đăng ký user mới
 */
const createUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const response = await UserService.createUser(name, email, password, phone);
    return res.status(201).json(response);
  } catch (error) {
    return res.status(400).json({
      status: "ERR",
      message: error.message || error,
    });
  }
};

/**
 * Đăng nhập
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await UserService.loginUser(email, password);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(401).json({
      status: "ERR",
      message: error.message || error,
    });
  }
};

/**
 * Refresh access token
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const response = await UserService.refreshAccessToken(refreshToken);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(401).json({
      status: "ERR",
      message: error.message || "Token refresh failed",
    });
  }
};

/**
 * Lấy profile user hiện tại
 */
const getProfile = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.user.id);
    res.json({
      status: "OK",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

/**
 * Upload / cập nhật avatar
 */
const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "ERR",
        message: "Vui lòng chọn file ảnh để upload",
      });
    }

    const avatarUrl = getImageUrl(req.file);
    const user = await UserService.updateAvatar(req.user.id, avatarUrl);

    res.json({
      status: "OK",
      message: "Cập nhật avatar thành công",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

/**
 * Cập nhật thông tin profile
 */
const updateProfile = async (req, res) => {
  try {
    const user = await UserService.updateProfile(req.user.id, req.body);
    res.json({
      status: "OK",
      message: "Cập nhật profile thành công",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  refreshToken,
  getProfile,
  updateAvatar,
  updateProfile,
};
