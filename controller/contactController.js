const asyncHandler = require("express-async-handler");
const { user, userblogs, admin } = require("../models/contactsModels");
const AuthHelper = require("../helper/auth.helper");
const jwt = require("jsonwebtoken");

// Serve static files in 'uploads/' directo
// @desc Get all data
// @desc Get api
// @desc Access public

const getDatas = asyncHandler(async (request, response) => {
  const contacts = await userblogs.find();

  response.status(200).json(contacts);
});

// @desc Get data by Id
// @desc Get api
// @desc Access public
const getData = asyncHandler(async (request, response) => {
  const contact = await userblogs.findById(request.params.id);
  if (!contact) {
    response.status(404);
    throw new Error("User not found.!");
  }
  response.status(200).json(contact);
});

// @desc Create data
// @desc POST api
// @desc Access public
//
const createData = asyncHandler(async (request, response) => {
  const { blogtitle, blogcontent, blogcategory, blogstatus, image, userId } =
    request.body;
  if (
    !blogtitle ||
    !blogcontent ||
    !blogcategory ||
    !blogstatus ||
    !userId ||
    !image
  ) {
    response.status(400);
    throw new Error("all fields are mandatory");
  }
  const contact = await userblogs.create({
    blogtitle,
    blogcontent,
    image,
    blogcategory,
    blogstatus,
    userId,
  });
  response.status(201).json(contact);
});

const imageuplaod = async (request, response) => {
  console.log(request.file); // Access uploaded file information
  response.send(`localhost:5000/${request.file.filename}`);
  // response.render("the_template", { name: request.body.name });
};

// @desc Update data by Id
// @route PATCH /api/blog/:id
// @access Public

const updateData = asyncHandler(async (request, response) => {
  const { blogtitle, blogcontent, image, blogcategory, blogstatus, userId } =
    request.body;

  // Get the ID from the URL
  const id = request.params.id;
  const token = request.headers.authorization;
  if (!token) {
    return response.status(401).json({ error: "Token is missing" });
  }

  try {
    if (payload.isAdmin) {
      const existingBlog = await userblogs.findById(id);

      if (!existingBlog) {
        response.status(404);
        throw new Error("Blog not found");
      }

      // Update the blog data
      existingBlog.blogtitle = blogtitle || existingBlog.blogtitle;
      existingBlog.blogcontent = blogcontent || existingBlog.blogcontent;
      existingBlog.image = image || existingBlog.image;
      existingBlog.blogcategory = blogcategory || existingBlog.blogcategory;
      existingBlog.blogstatus = blogstatus || existingBlog.blogstatus;
      existingBlog.userId = userId || existingBlog.userId;

      const updatedBlog = await existingBlog.save();
      response.status(200).json(updatedBlog);
    }
    else{
      response.status(401).json({ message: "Only admin can update" });
    }
  } catch (error) {
    response.status(500);
    throw new Error("Server error");
  }
});

// @desc delete all data
// @desc DELETE api
// @desc Access public

const deleteAllData = asyncHandler(async (request, response) => {
  response.status(200).json({
    message: "delete all data",
  });
});

// @desc delete  data By Id
// @desc DELETE api
// @desc Access public

const deleteData = asyncHandler(async (request, response) => {
  const contact = await userblogs.findByIdAndRemove(request.params.id);
  if (!contact) {
    response.status(404);
    throw new Error("User not found.!");
  }
  response.status(200).json(contact);
});

// @registration

const registration = asyncHandler(async (request, response) => {
  console.log("create data body:- ", request.body);
  const { email, password } = request.body;
  try {
    if (!email || !password) {
      response.status(400).json({ error: "All fields are mandatory" });
      return;
    }
    const contact = await user.create({
      email,
      password,
    });
    response.status(201).json(contact);
  } catch (error) {
    response.status(400).json({ error: "Invalid email" });
  }
});

const login = asyncHandler(async (request, response) => {
  // console.log("request.body", request.body);
  const { email, password } = request.body;
  if (!email || !password) {
    response.status(400).json({ error: "All fields are mandatory" });
    return;
  }

  try {
    // Find the user by email
    const foundUser = await user.findOne({ email });
    if (!foundUser) {
      response.status(400).json({ error: "User not found" });
      return;
    }
    if (password !== foundUser.password) {
      response.status(401).json({ error: "Invalid credentials" });
    }
    if (foundUser.isEnable == "true") {
      response.status(401).json({
        error: "An error has occurred please contact your administrator",
      });
    } else {
      const payload = {
        userId: foundUser._id,
        isAdmin: foundUser.isAdmin,
      };

      // Generate JWT tokens
      const accessToken = AuthHelper.generateAccessToken(payload);
      const refreshToken = AuthHelper.generateRefreshToken(payload);

      response.status(200).json({
        message: "Login successful",
        userID: foundUser._id,
        data: {
          accessToken,
          refreshToken,
        },
      });
    }
  } catch (error) {
    response.status(500).json({ error: "Internal server error" });
  }
});

// @ admin registration

const adminRegistration = asyncHandler(async (request, response) => {
  const { email, password } = request.body;
  if (!email || !password) {
    response.status(400);
    throw new Error("All fields are mandatory");
  }

  const existingAdminsCount = await admin.countDocuments({});
  if (existingAdminsCount > 0) {
    // response.status(409);
    response.status(409).json({ error: "An admin already exists" });
  }

  const Admin = await admin.create({
    email,
    password,
    isAdmin: true,
  });

  response.status(201).json({
    message: "Admin registration done!",
  });
});

const adminLogin = asyncHandler(async (request, response) => {
  // console.log("request.body", request.body);
  const { email, password } = request.body;
  if (!email || !password) {
    response.status(400).json({ error: "All fields are mandatory" });
    return;
  }

  try {
    // Find the user by email
    const foundUser = await admin.findOne({ email });

    if (!foundUser) {
      response.status(400).json({ error: "User not found" });
      return;
    }
    if (password !== foundUser.password) {
      response.status(401).json({ error: "Invalid credentials" });
    }
    if (foundUser.isAdmin) {
      const payload = {
        userId: foundUser._id,
        isAdmin: foundUser.isAdmin,
      };

      console.log("paylod", payload);
      // Generate JWT tokens
      const accessToken = AuthHelper.generateAccessToken(payload);
      const refreshToken = AuthHelper.generateRefreshToken(payload);

      response.status(200).json({
        message: "Admin Login successful",
        userID: foundUser._id,
        data: {
          accessToken,
          refreshToken,
        },
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Internal server error" });
  }
});

const getAdmins = asyncHandler(async (request, response) => {
  const contacts = await admin.find();

  response.status(200).json(contacts);
});

const users = asyncHandler(async (request, response) => {
  const token = request.headers.authorization;
  if (!token) {
    return response.status(401).json({ error: "Token is missing" });
  }
  try {
    const payload = AuthHelper.verifyAccessToken(token);

    if (payload.isAdmin) {
      const page = parseInt(request.query.page) || 1;
      const pageSize = parseInt(request.query.pageSize) || 10;

      const skip = (page - 1) * pageSize;

      const totalUsers = await user.countDocuments();

      const users = await user.find().skip(skip).limit(pageSize);

      response.status(200).json({
        users,
        page,
        pageSize,
        totalPages: Math.ceil(totalUsers / pageSize),
      });
    } else {
      response.status(401).json({ message: "Only admin can access user list" });
    }
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

const getUser = asyncHandler(async (request, response) => {
  const token = request.headers.authorization;
  if (!token) {
    return response.status(401).json({ error: "Token is missing" });
  }
  const payload = AuthHelper.verifyAccessToken(token);

  try {
    if (payload.isAdmin) {
      const contact = await user.findById(request.params.id);
      if (!contact) {
        response.status(404);
        throw new Error("User not found.!");
      }
      response.status(200).json(contact);
    }
  } catch (error) {
    response
      .status(500)
      .json({ message: "only admin can access  user detail" });
  }
});

const updateUser = asyncHandler(async (request, response) => {
  const { email, password, isEnable } = request.body;
  console.log("bodyy>>", request.body);
  const id = request.params.id;
  const token = request.headers.authorization;

  if (!token) {
    return response.status(401).json({ error: "Token is missing" });
  }

  const payload = AuthHelper.verifyAccessToken(token);

  try {
    if (payload.isAdmin) {
      const existingUser = await user.findById(id);

      if (!existingUser) {
        return response.status(404).json({ error: "User not found" });
      }

      // Update the user
      existingUser.email = email || existingUser.email;
      existingUser.password = password || existingUser.password;
      existingUser.isEnable = isEnable || existingUser.isEnable;

      const updatedUser = await existingUser.save();

      return response.status(200).json({ message: "User updated" });
    } else {
      return response.status(401).json({ message: "Only admin can update" });
    }
  } catch (error) {
    return response.status(500).json({ error: "Server error" });
  }
});

module.exports = {
  getDatas,
  getData,
  createData,
  updateData,
  deleteData,
  deleteAllData,
  registration,
  login,
  users,
  imageuplaod,
  adminRegistration,
  adminLogin,
  getAdmins,
  getUser,
  updateUser,
};
