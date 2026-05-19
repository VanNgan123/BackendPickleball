const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cấu hình storage chung cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
    cb(null, uniqueName);
  },
});

// Bộ lọc file: chỉ cho phép ảnh
const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Chỉ cho phép upload file ảnh (jpeg, png, gif, webp)"
      ),
      false
    );
  }
};

// Tạo multer instance với cấu hình chung
const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB mỗi file
  },
});

// =============================================
// Các middleware upload dùng cho từng use-case
// =============================================

/**
 * Upload nhiều ảnh sản phẩm (tối đa 5)
 */
const uploadProductImages = upload.array("images", 5);

/**
 * Upload nhiều ảnh review (tối đa 5)
 */
const uploadReviewImages = upload.array("images", 5);

/**
 * Upload 1 ảnh đại diện cho category
 */
const uploadCategoryImage = upload.single("image");

/**
 * Upload 1 ảnh avatar cho user
 */
const uploadUserAvatar = upload.single("avatar");

// =============================================
// Middleware xử lý lỗi multer
// =============================================
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Lỗi từ multer
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          status: "ERR",
          message: "File quá lớn. Giới hạn tối đa 5MB mỗi file.",
        });
      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          status: "ERR",
          message: "Số lượng file vượt quá giới hạn cho phép.",
        });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          status: "ERR",
          message: `Field '${err.field}' không hợp lệ hoặc không được phép upload.`,
        });
      default:
        return res.status(400).json({
          status: "ERR",
          message: `Lỗi upload: ${err.message}`,
        });
    }
  }

  if (err && err.message) {
    // Lỗi custom từ fileFilter
    return res.status(400).json({
      status: "ERR",
      message: err.message,
    });
  }

  next(err);
};

// =============================================
// Helper: tạo URL ảnh từ file đã upload
// =============================================

/**
 * Tạo URL ảnh từ file multer (dùng trong controller)
 * @param {Object} file - Multer file object
 * @returns {string} - URL ảnh dạng /uploads/filename
 */
const getImageUrl = (file) => {
  return `/uploads/${file.filename}`;
};

/**
 * Tạo danh sách URL ảnh từ nhiều file multer
 * @param {Array} files - Mảng multer file objects
 * @returns {Array<string>} - Mảng URL ảnh
 */
const getImageUrls = (files) => {
  if (!files || files.length === 0) return [];
  return files.map((file) => `/uploads/${file.filename}`);
};

/**
 * Xoá file ảnh khỏi disk
 * @param {string} imagePath - Path ảnh dạng /uploads/filename
 */
const deleteImageFile = (imagePath) => {
  if (!imagePath) return;
  const filePath = path.join(__dirname, "../..", imagePath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  upload,
  uploadProductImages,
  uploadReviewImages,
  uploadCategoryImage,
  uploadUserAvatar,
  handleMulterError,
  getImageUrl,
  getImageUrls,
  deleteImageFile,
};
