const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs").promises;
const path = require("path");

exports.generatePDF = async () => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont("Helvetica-Bold");

  // Set the font on the page
  page.setFont(font);

  // Get the content stream for drawing text
  const drawTextOptions = {
    x: 50,
    y: 300,
    size: 30,
    color: rgb(0, 0, 0),
  };

  // Draw text on the page
  page.drawText("Hello,This is a new PDF!", drawTextOptions);

  const pdfBytes = await pdfDoc.save();

  // Get the full path to the PDF file using __dirname
  const pdfFilePath = path.join("./uploads/generated-pdf.pdf");

  // Write the PDF file to the specified path
  await fs.writeFile(pdfFilePath, pdfBytes);

  // Return the full path to the generated PDF file
  return pdfFilePath;
};
// async function generatePDF() {
//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage([600, 400]);
//   const font = await pdfDoc.embedFont("Helvetica-Bold");

//   // Set the font on the page
//   page.setFont(font);

//   // Get the content stream for drawing text
//   const drawTextOptions = {
//     x: 50,
//     y: 300,
//     size: 30,
//     color: rgb(0, 0, 0),
//   };

//   // Draw text on the page
//   page.drawText("Hello,  this is a new PDF!", drawTextOptions);

//   const pdfBytes = await pdfDoc.save();

//   // Get the full path to the PDF file using __dirname
//   const pdfFilePath = path.join("./uploads/generated-pdf.pdf");

//   // Write the PDF file to the specified path
//   await fs.writeFile(pdfFilePath, pdfBytes);

//   // Return the full path to the generated PDF file
//   return pdfFilePath;
// }
// module.exports = { generatePDF };
