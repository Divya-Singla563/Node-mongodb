const router = require("express").Router();

router.use("/user", require("./user"));
router.use("/", require("./media"));
router.use("/", require("./category"));
router.use("/", require("./sub-category"));
router.use("/", require("./sub-category"));

module.exports = router;
