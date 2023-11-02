const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

class AuthHelper {
  static accessTokenSecret = process.env.ACCESS_SECRET_KEY || "";
  static refreshTokenSecret = process.env.REFRESH_TOKEN_KEY || "";
  static accessTokenExpiry = "7d";
  static refreshTokenExpiry = "7d";

  static generateAccessToken(payload) {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: 1000 * 60 * 60,
    });
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
    });
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshTokenSecret);
    } catch (error) {
      return null;
    }
  }
}

module.exports = AuthHelper;
