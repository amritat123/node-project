const express = require("express");
const router = express.Router();
const checkStudentAuth = require("../middleware/Student-check-auth");
const subjectController = require("../controller/subject");

router.post(
  "/insert-sub-mark",
  checkStudentAuth,
  subjectController.addSubjectMark
);
// without pagination
router.get("/get-list", checkStudentAuth, subjectController.getList);

// with pagination
router.get(
  "/get-list-page",
  checkStudentAuth,
  subjectController.getListWithPage
);

module.exports = router;
