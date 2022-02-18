//=> external imports
const express = require("express");

//=> internal imports
const { getUsers } = require("../controller/User/userController");
const documentHtmlResponse = require("../middlewares/common/documentHtmlResponse");
const avatarUploader = require("../middlewares/user/avatarUploader");
const { addUserValidators, addUserValidationHandler } = require("../middlewares/user/userValidator");

//=>
const router = express.Router();

//=> setting up the routing
// users page
router.get("/", documentHtmlResponse("User"), getUsers);

// add user
router.post("/", avatarUploader, addUserValidators, addUserValidationHandler);

// exporting
module.exports = router;
