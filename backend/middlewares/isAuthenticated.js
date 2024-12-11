const User = require("./../models/BaseModel");
const ErrorHandler = require("./../utils/ErrorHandler");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { user_token } = req.cookies;
    if (!user_token) {
      return next(new ErrorHandler("Token was expired!!", 500));
    } else {
      const userData = jwt.verify(user_token, process.env.JWT_SECRET);
      const user = await User.findById({ _id: userData.id });
      if (!user) {
        return next(new ErrorHandler("User Not Found!", 500));
      }
      req.user = user;
      next();
    }
  } catch (error) {
    next(error);
  }
};
