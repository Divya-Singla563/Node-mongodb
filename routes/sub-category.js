const express = require("express");
const router = express.Router();
const { authVerify } = require("../middlewares/auth");
const { subCategory } = require("../controllers");

router.post("/sub-category", authVerify, subCategory.addSubCategory);
router.get("/sub-category", authVerify, subCategory.getAllSubCategory);
router.get("/sub-category/:id", authVerify, subCategory.getSubCategoryById);
router.put("/sub-category/:id", authVerify, subCategory.updateSubCategory);
router.delete(
  "/sub-category/:id",
  authVerify,
  subCategory.deleteSubCategoryById
);
module.exports = router;
