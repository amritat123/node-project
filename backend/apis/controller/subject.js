const SubjectModel = require("../model/subject");
const mongoose = require("mongoose");
const niv = require("node-input-validator");

//API to insert subject and marks for logged in user
exports.addSubjectMark = async (req, res) => {
  const ObjValidation = new niv.Validator(req.body, {
    subject: "required",
    marks: "required",
  });
  const match = await ObjValidation.check();
  if (!match) {
    return res.status(404).send({
      Message: "Validation failed",
      error: ObjValidation.errors,
    });
  }
  try {
    const id = req.userData.id;
    const { subject, marks } = req.body;
    //in key Always we have to give model key name
    const result = new SubjectModel({
      subject: subject,
      marks: marks,
      studentId: id,
    });
    await result.save();

    return res.status(200).send({
      message: "Subject ,Marks are added",
      result: result,
    });
  } catch (error) {
    console.log("error :-", error);
    return res.status(500).send({
      message: "Error accorded , please try again later",
      error: error,
    });
  }
};

// Get record with out pagination
exports.getList = async (req, res) => {
  const id = req.userData.id;
  try {
    const resultData = await SubjectModel.find({ id });
    if (!resultData) {
      return res.status(404).send({
        message: "Student details not found",
      });
    }
    return res.status(200).send({
      message: "subject list fetched successfully",
      details: resultData,
    });
  } catch (error) {
    console.log("error :-", error);
    return res.status(500).send({
      message: "Error accorded , please try again later",
      error: error,
    });
  }
};

//get record with pagination
exports.getListWithPage = async (req, res) => {
  let { limit, page, search } = req.query;

  if ([1, "", 0, "undefined", "null", null, undefined].includes(page)) {
    page = 1;
  }
  if ([1, 0, "undefined", "null", null, undefined].includes(limit)) {
    limit = 10;
  }
  if (["undefined", "null", "", undefined, null].includes(search)) {
    search = "";
  }
  let options = {
    limit: limit,
    page: page,
  };
  const matchObj = {};
  matchObj.status = [1, 2];
  if (search) {
    options.search = {
      $regex: search,
      $options: "i", // "i" for case-insensitive search
    };
  }

  try {
    const id = req.userData.id;
    const resultData = await SubjectModel.aggregate([
      {
        $project: {
          subject: 1,
          marks: 1,
          studentId: 1,
        },
      },
      {
        $match: matchObj,
      },
    ]);

    const resultDataPaginate = await SubjectModel.aggregatePaginate(
      resultData,
      options
    );
    if (!resultData) {
      return res.status(404).send({
        message: "Student details not found",
      });
    }

    return res.status(200).send({
      message: "Students listing fetched successfully",
      student_list: resultDataPaginate,
    });
  } catch (error) {
    console.log("error :-", error);
    return res.status(500).send({
      message: "Error accorded , please try again later",
      error: error,
    });
  }
};
