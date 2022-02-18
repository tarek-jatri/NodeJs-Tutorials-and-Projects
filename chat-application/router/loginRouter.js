//=> external imports
const express = require("express");

//=> internal imports
const { getLogin } = require("../controller/Login/loginController");
const documentHtmlResponse = require("../middlewares/common/documentHtmlResponse");

//=>
const router = express.Router();

//=> setting up the routing
// login page
router.get("/", documentHtmlResponse("Login"), getLogin);

// exporting
module.exports = router;
