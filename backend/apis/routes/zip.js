const express = require("express");
const router = express.Router();

const zipController = require("../controller/zip");

router.get("/generate-zip", zipController.generateZip);

module.exports = router;
