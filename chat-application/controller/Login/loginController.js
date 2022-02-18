// get login page
function getLogin(req, res, next) {
  res.render("index");
}

// exporting
module.exports = {
  getLogin,
};
