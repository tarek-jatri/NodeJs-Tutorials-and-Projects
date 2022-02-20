// get login page
function getUsers(req, res, next) {
  res.render("users");
}

// add(crate) user's info to the database
async function addUser(req, res, next) {

}

// exporting
module.exports = {
  getUsers,
};
