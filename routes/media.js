const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const {
  uploadSingle,
  generateInvoice,
  generateInvoiceLink,
} = require("../controllers/media");

router.post("/upload", upload.single("image"), uploadSingle);
router.get("/invoice/:invoiceNo", generateInvoiceLink);

module.exports = router;
