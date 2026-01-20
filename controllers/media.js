const cloudinary = require("../utils/cloudinary");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const uploadSingle = async (req, res) => {
  console.log("[JS] media.js:3 - req:");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return res.status(500).json({ message: error.message });
        }

        res.json({
          public_id: result.public_id,
          url: result.secure_url,
        });
      })
      .end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//for generatingPdf link in response
const generateInvoiceLink = async (req, res) => {
  const { invoiceNo } = req.params;

  try {
    const dirPath = path.join(__dirname, "../uploads/invoices");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, `${invoiceNo}.pdf`);
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/invoices/${invoiceNo}.pdf`;

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();
    doc.text(`Invoice No: ${invoiceNo}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);

    doc.end();

    doc.on("end", () => {
      return res.json({
        success: true,
        invoiceUrl: fileUrl,
      });
    });
  } catch (error) {
    console.error("Invoice generate error:", error);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};

//for generatingPdf in response
const generateInvoice = async (req, res) => {
  const { invoiceNo } = req.params;
  console.log("[JS] media.js:29 - invoiceNo:", invoiceNo);
  try {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=${req.params.invoiceNo}.pdf`,
    );

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.text(`Invoice No: ${req.params.invoiceNo}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);

    doc.end();
  } catch (error) {
    console.error("Invoice stream error:", error);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};

module.exports = { uploadSingle, generateInvoice, generateInvoiceLink };
