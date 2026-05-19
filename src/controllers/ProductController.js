const productServices = require("../services/ProductServices");
const { getImageUrls } = require("../middleware/uploadMiddleware");

const createProduct = async (req, res) => {
  try {
    const imageUrls = getImageUrls(req.files);
    const product = await productServices.createProduct(req.body, imageUrls);

    res.status(201).json({
      status: "OK",
      message: "Thêm sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const product = await productServices.getAllProduct();
    res.status(200).json({
      status: "OK",
      message: "Lấy danh sách sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const searchAndFilterProducts = async (req, res) => {
  try {
    const result = await productServices.searchAndFilterProducts(req.query);
    res.status(200).json({
      status: "OK",
      message: "Tìm kiếm sản phẩm thành công",
      data: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productServices.getProductById(req.params.id);
    res.status(200).json({
      status: "OK",
      message: "Lấy sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updated = await productServices.updateProduct(
      req.params.id,
      req.body,
      req.files
    );
    res.json({
      status: "OK",
      message: "Cập nhật sản phẩm thành công",
      data: updated,
    });
  } catch (err) {
    res.status(400).json({
      status: "ERR",
      message: err.message,
    });
  }
};

const deleteProductImage = async (req, res) => {
  try {
    const updated = await productServices.deleteProductImage(
      req.params.id,
      req.params.index
    );
    res.json({
      status: "OK",
      message: "Xóa ảnh sản phẩm thành công",
      data: updated,
    });
  } catch (err) {
    res.status(400).json({
      status: "ERR",
      message: err.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await productServices.deleteProduct(req.params.id);
    res.json({
      status: "OK",
      message: "Xóa sản phẩm thành công",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      status: "ERR",
      message: err.message,
    });
  }
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