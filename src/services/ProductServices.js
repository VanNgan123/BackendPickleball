const slugify = require("slugify");
const Product = require("../models/Product");
const Category = require("../models/Category");
const { deleteImageFile, getImageUrls } = require("../middleware/uploadMiddleware");

const parseCategories = (categories) => {
  if (!categories) return [];

  if (Array.isArray(categories)) {
    return categories.filter(Boolean);
  }

  if (typeof categories === "string") {
    const trimmedCategories = categories.trim();
    if (!trimmedCategories) return [];

    try {
      const parsedCategories = JSON.parse(trimmedCategories);
      return Array.isArray(parsedCategories)
        ? parsedCategories.filter(Boolean)
        : [parsedCategories];
    } catch {
      return [trimmedCategories];
    }
  }

  return [categories];
};

const parseSpecs = (specs) => {
  if (!specs) return {};

  if (typeof specs === "object") {
    return specs;
  }

  if (typeof specs === "string") {
    const trimmedSpecs = specs.trim();
    if (!trimmedSpecs) return {};

    try {
      const parsedSpecs = JSON.parse(trimmedSpecs);
      if (parsedSpecs && typeof parsedSpecs === "object" && !Array.isArray(parsedSpecs)) {
        return parsedSpecs;
      }

      throw new Error("Specs must be a JSON object");
    } catch (error) {
      if (error.message === "Specs must be a JSON object") {
        throw error;
      }

      throw new Error("Specs phải là JSON hợp lệ");
    }
  }

  throw new Error("Specs phải là JSON hợp lệ");
};

const createProduct = async (data, imageUrls) => {
  const { name, price, categories, specs, stock, salePrice, brand } = data;

  if (!name || !price) throw new Error("Name or price is required");

  const slug = slugify(name, { lower: true, strict: true });

  const checkProduct = await Product.findOne({ slug });
  if (checkProduct) throw new Error("Product already exists");

  const parsedCategories = parseCategories(categories);

  if (parsedCategories.length > 0) {
    const found = await Category.find({ _id: { $in: parsedCategories } });
    if (found.length !== parsedCategories.length)
      throw new Error("Some category IDs do not exist");
  }

  const product = await Product.create({
    name,
    slug,
    price,
    salePrice: salePrice || null,
    brand: brand || null,
    categories: parsedCategories,
    specs: parseSpecs(specs),
    stock: stock || 0,
    image: imageUrls || [],
  });

  return product;
};

const getAllProduct = async () => {
  try {
    const products = await Product.find().populate("categories", "name slug");
    return products;
  } catch (error) {
    console.log("🚀 ~ getAllProducts ~ error:", error.message);
    throw error;
  }
};

// Tìm kiếm & lọc sản phẩm
const searchAndFilterProducts = async (filters = {}) => {
  try {
    const {
      search = "",
      category,
      minPrice = 0,
      maxPrice = Number.MAX_VALUE,
      minRating = 0,
      brand,
      sort = "newest",
      page = 1,
      limit = 12,
    } = filters;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.max(Number(limit) || 12, 1);
    const minParsed = Number(minPrice);
    const maxParsed = Number(maxPrice);
    const min = Number.isFinite(minParsed) ? minParsed : 0;
    const max = Number.isFinite(maxParsed) ? maxParsed : Number.MAX_VALUE;

    // Build query
    let query = {};

    // Tìm kiếm theo tên, brand, description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Lọc theo danh mục
    if (category) {
      query.categories = category;
    }

    // Lọc theo giá
    query.price = { $gte: min, $lte: max };

    // Lọc theo brand
    if (brand) {
      query.brand = brand;
    }

    // Xây dựng sort option
    let sortOptions = {};
    switch (sort) {
      case "price_asc":
        sortOptions = { price: 1 };
        break;
      case "price_desc":
        sortOptions = { price: -1 };
        break;
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "best_seller":
        sortOptions = { stock: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Pagination
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(query)
      .populate("categories", "name slug")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    // Tính tổng số sản phẩm
    const total = await Product.countDocuments(query);

    return {
      products,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },
    };
  } catch (error) {
    console.log("🚀 ~ searchAndFilterProducts ~ error:", error.message);
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    const product = await Product.findById(id).populate(
      "categories",
      "name slug"
    );
    return product;
  } catch (error) {
    console.log("🚀 ~ getProductById ~ error:", error.message);
    throw error;
  }
};

const updateProduct = async (id, data, files) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");
  if (files && files.length > 0) {
    const newImages = getImageUrls(files);
    product.image.push(...newImages);
  }
  if (data.name) {
    product.name = data.name;
    product.slug = slugify(data.name, { lower: true, strict: true });
  }
  if (data.price !== undefined) product.price = data.price;
  if (data.salePrice !== undefined) product.salePrice = data.salePrice;
  if (data.description !== undefined) product.description = data.description;
  if (data.brand !== undefined) product.brand = data.brand;
  if (data.stock !== undefined) product.stock = data.stock;
  if (data.categories !== undefined) {
    product.categories = parseCategories(data.categories);
  }
  if (data.specs !== undefined) {
    product.specs = parseSpecs(data.specs);
  }

  return await product.save();
};

const deleteProductImage = async (id, index) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  const img = product.image[index];
  if (!img) throw new Error("Image not found");

  deleteImageFile(img);

  product.image.splice(index, 1);

  return await product.save();
};

const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  // Xoá tất cả file ảnh vật lý
  if (product.image && product.image.length > 0) {
    product.image.forEach((imgPath) => {
      deleteImageFile(imgPath);
    });
  }

  // Xoá product khỏi DB
  await Product.findByIdAndDelete(id);
  return { message: "Product deleted successfully" };
};

module.exports = {
  createProduct,
  getAllProduct,
  searchAndFilterProducts,
  getProductById,
  updateProduct,
  deleteProductImage,
  deleteProduct,
};
