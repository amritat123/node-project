const excelJs = require("exceljs");
const fs = require("fs").promises;
const path = require("path");

exports.generateExcel = async () => {
  // Define the file path where you want to save the Excel file
  const excelFilePath = "./uploads/excel/generated-excel.xlsx";

  const workbook = new excelJs.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  // Define the headers as an array of strings
  const headers = ["Name", "Age", "Country"];

  // Adding these headers to the worksheet
  worksheet.addRow(headers);

  // Define some sample data
  const data = [
    ["Alice", 30, "USA"],
    ["Bob", 25, "Canada"],
    ["Charlie", 35, "UK"],
  ];

  // Add the data to the worksheet
  data.forEach((row) => {
    worksheet.addRow(row);
  });

  // Generate the Excel file buffer
  const excelBuffer = await workbook.xlsx.writeBuffer();

  try {
    // Write the buffer to the file
    await fs.writeFile(excelFilePath, excelBuffer);

    // Return a success message
    return `Excel file generated successfully`;
  } catch (error) {
    // Handle any errors that may occur during file writing
    console.error("Error writing Excel file:", error);
    throw error;
  }
};
