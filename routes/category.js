const express = require("express");
const router = express.Router();
const { authVerify } = require("../middlewares/auth");
const { category } = require("../controllers");

router.post("/category", authVerify, category.addCategory);
router.get("/category", authVerify, category.getAllCategory);
router.get("/category/:id", authVerify, category.getCategoryByID);
router.put("/category/:id", authVerify, category.updateCategory);
router.delete("/category/:id", authVerify, category.deleteCategoryByID);

module.exports = router;
