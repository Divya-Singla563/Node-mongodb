const { addCategoryValidation } = require("../validations/category");
const { category } = require("../services");

module.exports.addCategory = async (req, res, next) => {
  try {
    const { error } = await addCategoryValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const result = await category.addCategory(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports.getAllCategory = async (req, res, next) => {
  const { page, limit, search } = req.query;

  try {
    const result = await category.getAllCategory({ page, limit, search });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getCategoryByID = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await category.getCategoryById(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports.updateCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { error } = await addCategoryValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const result = await category.updateCategoryByID(id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports.deleteCategoryByID = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await category.deleteCategory(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
