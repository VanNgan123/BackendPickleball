const User = require("../models/User");
const bcrypt = require("bcrypt");
const {
  generateTokenPair,
  verifyRefreshToken,
  generateAccessToken,
} = require("./JwtServices");
const { deleteImageFile } = require("../middleware/uploadMiddleware");

/**
 * Tạo user mới
 */
const createUser = async (name, email, password, phone) => {
  try {
    if (!password) {
      throw new Error("Password is required");
    }
    const checkUser = await User.findOne({ email: email });

    if (checkUser) throw new Error("Email already exist");

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    // Không trả về password
    const userResponse = createdUser.toObject();
    delete userResponse.password;

    return {
      status: "OK",
      message: "User created successfully",
      data: userResponse,
    };
  } catch (error) {
    console.log("🚀 ~ createUser ~ error:", error);
    throw error;
  }
};

/**
 * Đăng nhập user - trả về cả access_token và refresh_token
 */
const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email không tồn tại");

    if (!user.isActive) throw new Error("Tài khoản đã bị vô hiệu hóa");

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) throw new Error("Mật khẩu không đúng");

    // Tạo cặp tokens
    const tokens = generateTokenPair({
      id: user.id,
      role: user.role,
    });

    return {
      status: "OK",
      message: "Đăng nhập thành công",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.log("🚀 ~ loginUser ~ error:", error);
    throw error;
  }
};

/**
 * Refresh access token bằng refresh token
 */
const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.payload.id;

    // Kiểm tra user còn tồn tại và active
    const user = await User.findById(userId);
    if (!user) throw new Error("User không tồn tại");
    if (!user.isActive) throw new Error("Tài khoản đã bị vô hiệu hóa");

    // Tạo access token mới
    const newAccessToken = generateAccessToken({
      id: user.id,
      role: user.role,
    });

    return {
      status: "OK",
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
    };
  } catch (error) {
    console.log("🚀 ~ refreshAccessToken ~ error:", error);
    throw error;
  }
};

/**
 * Lấy thông tin user theo ID
 */
const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new Error("User không tồn tại");
  return user;
};

/**
 * Cập nhật avatar cho user
 */
const updateAvatar = async (userId, avatarUrl) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User không tồn tại");

  // Xoá avatar cũ nếu có
  if (user.avatar) {
    deleteImageFile(user.avatar);
  }

  user.avatar = avatarUrl;
  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;
  return userResponse;
};

/**
 * Cập nhật thông tin profile
 */
const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User không tồn tại");

  if (data.name) user.name = data.name;
  if (data.phone) user.phone = data.phone;
  if (data.address) user.address = data.address;

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;
  return userResponse;
};

module.exports = {
  createUser,
  loginUser,
  refreshAccessToken,
  getUserById,
  updateAvatar,
  updateProfile,
};
