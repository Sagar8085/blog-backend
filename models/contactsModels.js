const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userBlogSchema = mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4, // Set a new UUID as the default v
    },
    blogtitle: {
      type: String,
      required: [true, "Please add the user title"],
      validate: {
        validator: (value) => value.length <= 150,
        message: "Title should not be greater than 150 characters",
      },
    },
    blogcontent: {
      type: String,
      required: [true, "Please add content"],
      validate: {
        validator: (value) => value.length <= 5000,
        message: "Content should not be more than 5000 characters",
      },
    },

    image: {
      type: String,
      required: [true, "Please add content"],
    },

    blogcategory: {
      type: String,
      required: [true, "please add the user category"],
    },
    blogstatus: {
      type: String,
      required: [true, "please add the user status"],
    },

    userId: {
      type: String,
      required: [true, "please add the user ID"],
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4, // Set a new UUID as the default v
    },
    email: {
      type: String,
      required: [true, "please enter valid email"],
      unique: true, // Ensure email is unique
      validate: {
        validator: function (value) {
          // Define a regular expression to validate email addresses
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          return emailRegex.test(value);
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "please enter valid password"],
    },
    phone: {
      type: String,
      validate: {
        validator: function (value) {
          const phoneRegex = /^\d{10}$/;
          return phoneRegex.test(value);
        },
        message: "Please enter a valid phone number",
      },
    },
    isEnable: {
      type: String,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const adminSchema = mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4, // Set a new UUID as the default v
    },
    email: {
      type: String,
      required: [true, "please enter valid email"],
      unique: true, // Ensure email is unique
      validate: {
        validator: function (value) {
          // Define a regular expression to validate email addresses
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          return emailRegex.test(value);
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "please enter valid password"],
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const userblogs = mongoose.model("userblogs", userBlogSchema);
const user = mongoose.model("users", userSchema);
const admin = mongoose.model("admin", adminSchema);
module.exports = {
  userblogs,
  user,
  admin,
};
