//=> external imports
const express = require("express");

//=> internal imports
const { getInboxes } = require("../controller/Inbox/inboxController");
const documentHtmlResponse = require("../middlewares/common/documentHtmlResponse");

//=>
const router = express.Router();

//=> setting up the routing
// inbox page
router.get("/", documentHtmlResponse("Inbox"), getInboxes);

// exporting
module.exports = router;
