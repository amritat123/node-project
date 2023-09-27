const express = require("express");
const router = express.Router();
const pdfController = require("../controller/pdf_generation");

router.get("/generate-pdf", async (req, res) => {
  try {
    const pdfBytes = await pdfController.generatePDF();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=generated-pdf.pdf"
    );
    res.send(pdfBytes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
