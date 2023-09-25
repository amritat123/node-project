const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const Helper = require("../helper/index");
const studentController = require("../controller/student");
const folderName = "./uploads/students/profilePic";
const checkStudentAuth = require("../middleware/Student-check-auth");

try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName, { recursive: true });
  }
} catch (error) {
  console.log("error -", error);
}
// File uploading using this multer code --
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, folderName);
  },
  filename: function (req, file, cb) {
    cb(null, Helper.generateRandomString(5) + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  // Reject file
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/gif" ||
    file.mimetype == "image/svg+xml"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .png, .jpg .gif and .jpeg format allowed!"));
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

router.post(
  "/register",
  upload.single("profilePic"),
  studentController.registerStudent
);
router.post("/login", studentController.loginStudent);

router.get("/my_profile", checkStudentAuth, studentController.myAuthProfile);

router.put(
  "/update_profile",
  upload.single("profilePic"),
  checkStudentAuth,
  studentController.updateProfile
);

router.put(
  "/delete_profile",
  checkStudentAuth,
  studentController.deleteProfile
);

module.exports = router;
