//=> external imports
const express = require("express");

//=> internal imports
const { getLogin, login } = require("../controller/Login/loginController");
const documentHtmlResponse = require("../middlewares/common/documentHtmlResponse");
const { doLoginValidators, doLoginValidationHandler } = require("../middlewares/login/loginValidator");


const page_title = "Login";


//=>
const router = express.Router();

//=> setting up the routing
// login page
router.get("/", documentHtmlResponse(page_title), getLogin);

// login page
router.post("/", documentHtmlResponse(page_title), doLoginValidators, doLoginValidationHandler, login);

// exporting
module.exports = router;
