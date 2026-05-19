const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "ERR",
        message: "Không xác thực, không có token",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
      const user = await User.findById(decoded.payload.id).select("-password");
      if (!user) {
        return res.status(401).json({
          status: "ERR",
          message: "Người dùng không tồn tại",
        });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        status: "ERR",
        message: "Token không hợp lệ hoặc hết hạn",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: "Lỗi server trong quá trình xác thực",
    });
  }
};

const Admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      status: "ERR",
      message: "Chỉ Admin mới thực hiện được",
    });
  }
};

module.exports = {
  authMiddleware,
  Admin,
};