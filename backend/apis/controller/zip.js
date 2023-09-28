const fs = require("fs");
const archiver = require("archiver");
const path = require("path");

exports.generateZip = async (req, res) => {
  try {
    // Create a writable stream to store the zip file
    const outputPath = path.join("./uploads/zip/generated-files.zip");
    const output = fs.createWriteStream(outputPath);

    // Create a new archiver instance
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Set compression level (optional)
    });
    // Pipe the output stream to the archive
    archive.pipe(output);

    // Add files to the archive
    const filesToZip = [
      path.join("./uploads/file1.txt"),
      path.join("./uploads/file2.txt"),
      // Add more file paths as needed
    ];
    console.log("filesToZip", filesToZip);

    for (const file of filesToZip) {
      // Add each file to the archive
      archive.file(file, { name: path.basename(file) });
    }

    // Finalize the archive
    await archive.finalize();

    // Send the generated zip file as a response
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=generated-files.zip"
    );
    res.setHeader("Content-Type", "application/zip");
    const fileStream = fs.createReadStream(outputPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error generating the ZIP file");
  }
};
