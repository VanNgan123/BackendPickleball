const productServices = require("../services/ProductServices");
const { getImageUrls } = require("../middleware/uploadMiddleware");

const createProduct = async (req, res) => {
  try {
    const imageUrls = getImageUrls(req.files);
    const product = await productServices.createProduct(req.body, imageUrls);

    res.status(201).json({
      message: "Add product success",
      product
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const product = await productServices.getAllProduct();
    res.status(200).json({
      message: "List all product",
      product
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const searchAndFilterProducts = async (req, res) => {
  try {
    const result = await productServices.searchAndFilterProducts(req.query);
    res.status(200).json({
      message: "Search and filter products success",
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productServices.getProductById(req.params.id);
    res.status(200).json({
      message: "Get product by ID success",
      product
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
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
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteProductImage = async (req, res) => {
  try {
    const updated = await productServices.deleteProductImage(
      req.params.id,
      req.params.index
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await productServices.deleteProduct(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
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