/**
 * Title: User Handler
 * Description: Handler to handle user related routes
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 02/02/2022
 */

//=>Dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");
const { verifyToken } = require("../../handlers/routeHandlers/tokenHandler");
const { home } = require("nodemon/lib/utils");

//=>Module Scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._user[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

/**
 * this is a scaffolding for handling the methods action to user route
 * here we used scaffolding _user to say that it's a private property
 */
handler._user = {};

// to handle user's post actions -> CRUD - Create
handler._user.post = (requestProperties, callback) => {
  // verifying the credentials before creating
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName.trim()
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName.trim()
      : false;

  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone.trim()
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password.trim()
      : false;

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean"
      ? requestProperties.body.tosAgreement
      : false;

  // checking if they are ok or not and sending error
  if (firstName && lastName && phone && password && tosAgreement) {
    //make sure the user doesn't already exist
    data.read("user", phone, (err) => {
      if (err) {
        // creating the object to store
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        // storing the data to db(file system)
        data.create("user", phone, userObject, (err) => {
          if (!err) {
            callback(200, {
              message: "User created successfully....",
            });
          } else {
            callback(500, {
              error: "Could not create user!!!!",
            });
          }
        });
      } else {
        callback(500, {
          error: "There was a problem in the server side!!!!",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in Request",
    });
  }
};

// to handle user's get actions -> CRUD - Read
handler._user.get = (requestProperties, callback) => {
  // check if the user's phone number is valid or not
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone.trim()
      : false;
  // if valid then read and send the data to the response
  if (phone) {
    const id = requestProperties.headersObject.token;
    verifyToken(id, phone, (tokenStatus) => {
      if (tokenStatus) {
        // lookup for the user
        data.read("user", phone, (err, user) => {
          if (!err && data) {
            const userData = parseJSON(user);
            delete userData.password;
            callback(200, userData);
          } else {
            callback(404, {
              error: "Requested user not found!!!",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication failure!!!!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested user not found!!!",
    });
  }
};

// to handle user's put actions -> CRUD - Update
handler._user.put = (requestProperties, callback) => {
  // verifying the credentials before inserting
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName.trim()
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName.trim()
      : false;

  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone.trim()
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password.trim()
      : false;

  // if valid phone is given
  if (phone) {
    if (firstName || lastName || password) {
      const id = requestProperties.headersObject.token;
      verifyToken(id, phone, (tokenStatus) => {
        if (tokenStatus) {
          //  lookup for the user
          data.read("user", phone, (err, userData) => {
            if (!err && userData) {
              // changing string to JSON object
              const user = parseJSON(userData);
              // checking the fields and if exists then update it
              if (firstName) user.firstName = firstName;
              if (lastName) user.lastName = lastName;
              if (password) user.password = hash(password);

              // updating the user into database(file system)
              data.update("user", phone, user, (err) => {
                if (!err) {
                  callback(200, {
                    message: "User updated successfully...",
                  });
                } else {
                  callback(500, {
                    error: "There is s problem on server side!!!!!",
                  });
                }
              });
            } else {
              callback(400, {
                error: "There's a problem in request!!!",
              });
            }
          });
        } else {
          callback(403, {
            error: "Authentication failure!!!!",
          });
        }
      });
    } else {
      callback(400, {
        error: "There's a problem in request!!!",
      });
    }
  } else {
    callback(400, {
      error: "Invalid phone number! Please try again... ",
    });
  }
};

// to handle user's delete actions -> CRUD - Delete
handler._user.delete = (requestProperties, callback) => {
  // check if the user's phone number is valid or not
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone.trim()
      : false;
  if (phone) {
    const id = requestProperties.headersObject.token;
    verifyToken(id, phone, (tokenStatus) => {
      if (tokenStatus) {
        // lookup for the user
        data.read("user", phone, (err, user) => {
          if (!err && user) {
            data.delete("user", phone, (err) => {
              if (!err) {
                callback(200, {
                  message: "User deleted successfully",
                });
              } else {
                callback(500, {
                  error: "There is a problem on the server side!!!!",
                });
              }
            });
          } else {
            callback(404, {
              error: "User not found!!!!",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication failure!!!!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Invalid Number!!!!",
    });
  }
};

module.exports = handler;
