const { default: slugify } = require("slugify");
const Category = require("../models/Category");
const { deleteImageFile } = require("../middleware/uploadMiddleware");

const createCategory = async ({ name, parentId = null }, imageUrl = null) => {
  if (!name || typeof name !== "string") {
    throw new Error("Invalid category name");
  }
  const slug = slugify(name, { lower: true, strict: true });
  const checkSlug = await Category.findOne({ slug });
  if (checkSlug) throw new Error("Category is already");
  const category = await Category.create({
    name,
    slug,
    parentId: parentId || null,
    image: imageUrl || null,
  });
  return category;
};

// Lấy tất cả danh mục
const getAllCategories = async () => {
  const categories = await Category.find().sort({ createdAt: -1 });
  return categories;
};

const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new Error("Không tìm thấy danh mục.");
  return category;
};

const updateCategory = async (id, data, imageUrl = null) => {
  const { name, parentId } = data;

  const category = await Category.findById(id);
  if (!category) throw new Error("Không tìm thấy danh mục.");

  if (name) {
    const slug = slugify(name, { lower: true, strict: true });
    const checkSlug = await Category.findOne({ slug, _id: { $ne: id } });
    if (checkSlug) throw new Error("Slug đã tồn tại.");
    category.name = name;
    category.slug = slug;
  }

  if (parentId !== undefined) category.parentId = parentId || null;

  // Nếu có ảnh mới, xoá ảnh cũ và cập nhật
  if (imageUrl) {
    if (category.image) {
      deleteImageFile(category.image);
    }
    category.image = imageUrl;
  }

  await category.save();
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new Error("Không tìm thấy danh mục.");

  // Xoá ảnh khi xoá category
  if (category.image) {
    deleteImageFile(category.image);
  }

  return category;
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
