const createError = require("http-errors");

// 404 not found handler
function notFoundHandler(req, res, next) {
  next(createError(404, "Your requested content was not found"));
}

// default error handler
function errorHandler(err, req, res, next) {
  // res.locals.title = "ErrorPage";

  res.locals.error =
    process.env.NODE_ENV === "development" ? err : { message: err.message };

  res.status(err.status || 500);

  /**
   * checking what kind of request is made http or api
   * and respond according to the  request
   **/
  if (!res.locals.html) {
    res.render("error", {
      title: "Error Page",
    });
  } else {
    res.json(res.locals.error);
  }
}

// exporting
module.exports = {
  notFoundHandler,
  errorHandler,
};
