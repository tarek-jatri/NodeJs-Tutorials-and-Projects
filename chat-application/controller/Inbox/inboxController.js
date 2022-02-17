// get login page
function getInboxes(req, res, next) {
  res.render("inbox");
}

// exporting
module.exports = {
  getInboxes,
};
