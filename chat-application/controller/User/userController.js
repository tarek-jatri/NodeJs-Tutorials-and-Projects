// get login page
function getUsers(req, res, next) {
  res.render("users");
}

// exporting
module.exports = {
  getUsers,
};
