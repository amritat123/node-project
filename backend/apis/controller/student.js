const StudentModel = require("../model/student");
const niv = require("node-input-validator");
const jwt = require("jsonwebtoken");
const FCMDB = require("../model/fcm");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const { find } = require("../model/student");

// First Register Student
exports.registerStudent = async (req, res) => {
  const ObjValidation = new niv.Validator(req.body, {
    email: "required",
    password: "required",
    confirm_password: "required",
  });
  const matched = await ObjValidation.check();
  // when Validation is required fields missed
  if (!matched) {
    return res.status(404).send({
      message: " Validation failed",
      error: ObjValidation.errors,
    });
  }
  if (matched) {
    // if confirm _password is not matched
    const password = req.body.password;
    const confirm_password = req.body.password;
    if (confirm_password != password) {
      return res.status(422).send({
        message: "Sorry! Password does not match",
      });
    }
  }
  try {
    //hashed password
    let hash = "";
    if (req.body.password) {
      hash = await bcrypt.hash(req.body.password, 10);
    }
    const { first_name, last_name, email, about_me, date_of_birth, status } =
      req.body;
    const checkStudentDetails = await StudentModel.findOne({
      email: email,
    });
    //already exists Student
    if (checkStudentDetails) {
      return res.status(403).send({
        message: "Student is already exists with this email",
      });
    }
    const createObj = {};
    (createObj.first_name = first_name),
      (createObj.last_name = last_name),
      (createObj.about_me = about_me),
      (createObj.email = email),
      (createObj.password = hash),
      (createObj.status = status),
      (createObj.date_of_birth = date_of_birth);
    if (req.file) createObj.profile_pic = req.file.filename;

    const result = new StudentModel(createObj);
    await result.save();

    const jwtToken = jwt.sign(
      {
        email: result.email,
        id: result._id,
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: "10d",
      }
    );
    // Return successful response
    return res.status(200).send({
      message: "Student registered successfully",
      token: jwtToken,
      Student_details: result,
    });
  } catch (error) {
    console.log("error :-", error);
    return res.status(500).send({
      message: "Error accorded , please try again later",
      error: error,
    });
  }
};

//Login Student
exports.loginStudent = async (req, res) => {
  const objValidation = new niv.Validator(req.body, {
    email: "required|email",
    password: "required",
  });

  const matched = await objValidation.check();

  if (!matched) {
    return res
      .status(422)
      .send({ message: "Validation error", errors: objValidation.errors });
  }
  try {
    let studentData = await StudentModel.aggregate([
      {
        $match: {
          email: req.body.email.toLowerCase(),
        },
      },
      {
        $project: {
          first_name: 1,
          last_name: 1,
          email: 1,
          about_me: 1,
          date_of_birth: 1,
          password: 1,
          profilePic: 1,
          status: 1,
        },
      },
    ]);
    if (!studentData[0]) {
      return res.status(401).send({
        message: "Please enter a valid email address",
      });
    }

    if (studentData[0].status == 2) {
      return res.status(409).send({
        message: "Your account is currently deactivated please contact admin",
      });
    }
    const checkPassword = await bcrypt.compare(
      req.body.password,
      studentData[0].password
    );
    if (!checkPassword) {
      return res.status(401).send({
        message: "Invalid password",
      });
    }
    const token = jwt.sign(
      {
        email: studentData[0].email,
        id: studentData[0]._id,
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: "10d",
      }
    );
    studentData[0].profile_pic =
      process.env.URL +
      process.env.STUDENT_PROFILE +
      studentData[0].profile_pic;
    delete studentData[0].password;
    return res.status(200).send({
      message: "Student has been successfully login",
      token: token,
      student_detail: studentData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err,
    });
  }
};

// My profile Info- (auth)
exports.myAuthProfile = async (req, res) => {
  const id = req.userData.id;
  try {
    const studentProfile = await StudentModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!studentProfile) {
      return res.status(404).send({
        message: "Sorry! Profile not found",
      });
    }
    studentProfile.profile_pic =
      process.env.URL +
      process.env.STUDENT_PROFILE +
      studentProfile.profile_pic;
    return res.status(200).send({
      message: "Student profile Found",
      result: studentProfile,
    });
  } catch (error) {
    console.log("error :-", error);
    return res.status(500).send({
      message: "Error accorded , please try again later",
      error: error,
    });
  }
};

//Update Profile Picture of student
exports.updateProfile = async (req, res) => {
  const id = req.userData.id;
  const matchObj = {};
  matchObj.first_name = req.body.first_name;
  matchObj.last_name = req.body.last_name;
  matchObj.date_of_birth = req.body.date_of_birth;
  matchObj.about_me = req.body.about_me;
  matchObj.email = req.body.email;
  matchObj.password = req.body.password;
  matchObj.status = req.body.password;
  if (req.file) matchObj.profile_pic = req.file.filename;

  try {
    const studentDetail = await StudentModel.findOneAndUpdate(
      { _id: id },
      {
        $set: matchObj,
      },
      {
        new: true,
      }
    );

    if (!studentDetail) {
      return res.status(404).send({
        message: "Sorry! Student details not found to update",
      });
    }
    if (studentDetail.profile_pic) {
      studentDetail.profile_pic =
        process.env.URL +
        process.env.STUDENT_PROFILE +
        studentDetail.profile_pic;
    }
    return res.status(200).send({
      message: "Profile Updated successfully",
      Updated_profile: studentDetail,
    });
  } catch (error) {
    console.log("error :-", error);
    return res.status(500).send({
      message: "Error accorded , please try again later",
      error: error,
    });
  }
};

// Soft Delete Student data
exports.deleteProfile = async (req, res) => {
  const id = req.userData.id;
  try {
    const studentData = await StudentModel.findOneAndUpdate(
      { _id: id },
      { $set: { status: 3 } },
      { new: true } // show updated field
    );
    if (!studentData) {
      return res.status(404).send({
        message: "Sorry! No student's data found to delete",
      });
    }

    return res.status(200).send({
      message: "Student's Profile deleted successfully",
      deleted_profile: {},
    });
  } catch (error) {
    console.log("error :-", error);
    return res.status(500).send({
      message: "Error accorded , please try again later",
      error: error,
    });
  }
};

exports.saveFCM = async (req, res) => {
  const ObjValidation = new niv.Validator(req.body, {
    device: "required",
    type: "required",
    token: "required",
  });
  const matched = await ObjValidation.check();
  if (!matched) {
    return res.status(422).json({
      message: "validation error",
      error: ObjValidation.errors,
    });
  }
  try {
    const { device, type, token, studentID } = req.body;
    let check = await FCMDB.findOne({ studentID: studentID });
    if (check) {
      await FCMDB.findOneAndUpdate(
        { studentID: studentID },
        { token: token, device: device }
      );
      return res.status(201).send({
        message: "Successful Exist",
        result: check,
      });
    }
    let result = await FCMDB.create({
      device: device,
      type: type,
      token: token,
      studentID: studentID,
    });
    return res.status(201).send({
      message: "Successful",
      result: result,
    });
  } catch (err) {
    console.log("error", err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err,
    });
  }
};
