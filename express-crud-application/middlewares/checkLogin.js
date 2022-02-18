const jwt = require("jsonwebtoken");

//=> Login Check Middleware
const checkLogin = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.username = decodedPayload.username;
    req.userId = decodedPayload.userId;
    next();
  } catch {
    next("Authentication  failed!!!");
  }
};

// Exporting
module.exports = checkLogin;
