const express = require("express");
const multer = require("multer");
const path = require("path");
// Set up Multer storage and file handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Uploads will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the uploaded file with a timestamp
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedMimes = ["image/png", "image/jpeg", "image/jpg"];
    if (allowedMimes.includes(file.mimetype)) {
      // Check if the MIME type is allowed
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // Set the file size limit to 2MB
  },
});
const {
  registration,
  login,
  getDatas,
  getData,
  createData,
  updateData,
  deleteData,
  deleteAllData,
  imageuplaod,
  adminLogin,
  adminRegistration,
  getAdmins,
  users,
  getUser,
  updateUser,
} = require("../controller/contactController");
const router = express.Router();
//@desc pass json data with status code and pass status code

// ============================admin APIs========================================
// @desc Registration api
router.route("/admin/signup").post(adminRegistration);

// //@desc login api
router.route("/admin/login").post(adminLogin);

// //@desc get all admin api
router.route("/admins").get(getAdmins);

// //@desc get all users api
router.route("/users").get(users);

// //@desc get  user api
router.route("/user/:id").get(getUser);

//@desc update data by id
router.route("/user/:id").patch(updateUser);

// =======================User APIs====================================================
// @desc Registration api
router.route("/signup").post(registration);

// //@desc login api
router.route("/login").post(login);

//@desc get call data
router.route("/").get(getDatas);
//@desc get data by id
router.route("/:id").get(getData);

//@desc create data
router.route("/").post(createData);

//@desc create data
// Define a Multer upload middleware for handling file uploads
const uploadMiddleware = upload.single("image");
router.route("/upload").post(uploadMiddleware, imageuplaod);

//@desc update data by id
router.route("/:id").patch(updateData);

//@desc delete data
router.route("/").delete(deleteAllData);

//@desc delete data by id
router.route("/:id").delete(deleteData);

module.exports = router;
