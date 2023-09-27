const express = require("express");
const router = express.Router();

const excelController = require("../controller/excel");

router.get("/generate-excel", async (req, res) => {
  try {
    const excelFilePath = await excelController.generateExcel();
    res.status(200).send(`${excelFilePath}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
