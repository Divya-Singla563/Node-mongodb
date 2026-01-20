const { subCategory } = require("../services");
const { addSubCategoryValidation } = require("../validations/category");

module.exports.addSubCategory = async (req, res, next) => {
  try {
    const { error } = await addSubCategoryValidation.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    const result = await subCategory.addSubCategory(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.log("[JS] sub-category.js:4 - error:", error);
    next(error);
  }
};

module.exports.getAllSubCategory = async (req, res, next) => {
  const { page, limit, search, category } = req.query;
  try {
    const result = await subCategory.getAllSubCategory({
      page,
      limit,
      search,
      category,
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getSubCategoryById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await subCategory.getSubCategoryById(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteSubCategoryById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await subCategory.deleteSubCategory(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports.updateSubCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { error } = await addSubCategoryValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const result = await subCategory.updateSubCategoryByID(id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};
