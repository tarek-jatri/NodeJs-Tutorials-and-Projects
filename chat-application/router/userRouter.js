//=> external imports
const express = require("express");

//=> internal imports
const { getUsers } = require("../controller/User/userController");
const documentHtmlResponse = require("../middlewares/common/documentHtmlResponse");

//=>
const router = express.Router();

//=> setting up the routing
// users page
router.get("/", documentHtmlResponse("User"), getUsers);

// exporting
module.exports = router;
