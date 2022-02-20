//=> external imports
const express = require("express");

//=> internal imports
const {
  getUsers,
  addUser,
  removeUser,
} = require("../controller/User/userController");
const documentHtmlResponse = require("../middlewares/common/documentHtmlResponse");
const avatarUploader = require("../middlewares/user/avatarUploader");
const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/user/userValidator");

//=>
const router = express.Router();

//=> setting up the routing
// users page
router.get("/", documentHtmlResponse("User"), getUsers);

/**
 * add user
 *  avatarUploader - file uploader middleware
 *  addUserValidators - array of middlewares to validate user inputs
 *  addUserValidationHandler - error handler for the errors from validator function
 **/
router.post(
  "/",
  avatarUploader,
  addUserValidators,
  addUserValidationHandler,
  addUser
);

// deleting user
router.delete("/:id", removeUser);

// exporting
module.exports = router;
