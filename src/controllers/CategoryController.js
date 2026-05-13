const categoryService = require("../services/CategoryServices");
const { getImageUrl } = require("../middleware/uploadMiddleware");

const create = async (req, res) => {
  try {
    const imageUrl = req.file ? getImageUrl(req.file) : null;
    const category = await categoryService.createCategory(req.body, imageUrl);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json(category);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const imageUrl = req.file ? getImageUrl(req.file) : null;
    const updated = await categoryService.updateCategory(req.params.id, req.body, imageUrl);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
};