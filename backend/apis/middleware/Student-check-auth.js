const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const StudentModel = require("../model/student");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const { id } = decoded;
    const studentData = await StudentModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (studentData === null || studentData.status !== 1) {
      return res.status(401).json({
        message: "Auth fail",
      });
    }
    req.userData = studentData;
    next();
  } catch (error) {
    console.log("error", error);
    return res.status(401).send({
      message: "Auth fail",
    });
  }
};
