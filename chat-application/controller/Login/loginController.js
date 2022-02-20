// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const User = require("../../models/People");

// get login page
function getLogin(req, res, next) {
  res.render("index");
}


// login user
async function login(req, res, next) {
  try {
    // find a user who has the email/phone
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });
    if (user && user._id) {
      // check if inserted password is valid
      const isValidPassword = await bcrypt.compare(req.body.password, user.password);
      if (isValidPassword) {
        // prepare the user object to generate token 
        const userObject = {
          username: user.name,
          mobile: user.mobile,
          email: user.email,
          role: "user",
        }
        // generate the token
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRY
        });

        // set the token into cookie
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRY,
          httpOnly: true,
          signed: true,
        })

        // set logged user infos 
        res.locals.loggedInUser = userObject;

        res.render("inbox");

      } else {
        throw createError("Login failed! Please try again...")
      }
    } else {
      throw createError("Login failed! Please try again...")
    }
  } catch (error) {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: error.message,
        }
      }
    });
  }
}

// exporting
module.exports = {
  getLogin,
  login,
};
