const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/mongodbConnection");
const cors = require("cors");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('uploads'))
const dotenv = require("dotenv").config(); // access env file data
const PORT = process.env.PORT || 3000;
const route = require("./routes/contactRoutes");
connectDb();
app.use(cors());
app.use(express.json()); // middleware for parse json body data
app.use((req, res, next) => {
  if (req.url) {
    console.log(req.url);
  }
  next();
});
app.use("/", route);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});
