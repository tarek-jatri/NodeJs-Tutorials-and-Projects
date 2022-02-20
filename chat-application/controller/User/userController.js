// external imports
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");

// internal imports
const User = require("../../models/People");

// get users information
async function getUsers(req, res, next) {
  try {
    const users = await User.find();
    res.render("users", {
      users,
    });
  } catch (error) {
    next(error);
  }
}

// add(crate) user's info to the database
async function addUser(req, res, next) {
  //  hash the password field first
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  //  creating the user object
  let newUser;
  if (req.files && req.files.length > 0) {
    newUser = new User({
      ...req.body,
      avatar: req.files[0].filename,
      password: hashedPassword,
    });
  } else {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
  }
  //  saving user to the database
  try {
    const result = await newUser.save();
    res.status(200).json({
      message: "user saved successfully",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occurred from user controller",
        },
      },
    });
  }
}

// removing user's data
async function removeUser(req, res, next) {
  try {
    //  deleting user
    const user = await User.findByIdAndDelete({
      _id: req.params.id,
    });
    //  removing avatar
    if (user.avatar) {
      unlink(
        path.join(__dirname, `/../../public/uploads/avatars/${user.avatar}`),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }

    //  sending response
    res.status(200).json({
      message: "User is removed successfully",
    });
  } catch (error) {
    //  sending response
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user",
        },
      },
    });
  }
}

// exporting
module.exports = {
  getUsers,
  addUser,
  removeUser,
};
