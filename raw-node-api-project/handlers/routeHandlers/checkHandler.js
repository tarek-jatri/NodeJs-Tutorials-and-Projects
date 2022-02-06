/**
 * Title: Check Handler
 * Description: Handler to handle user defined check
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 02/02/2022
 */

//=>Dependencies
const data = require("../../lib/data");
const { hash, creatingRandomString } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");
const { verifyToken } = require("../../handlers/routeHandlers/tokenHandler");
const { maxChecks } = require("../../helpers/environments");

//=>Module Scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

/**
 * this is a scaffolding for handling the methods action to check route
 * here we used scaffolding _check to say that it's a private property
 */
handler._check = {};

// to handle check's post actions -> CRUD - Create
handler._check.post = (requestProperties, callback) => {
  // verifying inputs
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url.trim()
      : false;

  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "UPDATE", "DELETE"].indexOf(requestProperties.body.method) >
      -1
      ? requestProperties.body.method
      : false;

  const successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  const timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === "number" &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
      ? requestProperties.body.timeoutSeconds
      : false;
  if (protocol && url && method && successCodes && timeoutSeconds) {
    const tokenId =
      typeof requestProperties.headersObject.token === "string" &&
      requestProperties.headersObject.token.trim().length === 20
        ? requestProperties.headersObject.token
        : false;

    //lookup the user's phone by reading the token
    data.read("tokens", tokenId, (err, strTokenData) => {
      if (!err && strTokenData) {
        const token = { ...parseJSON(strTokenData) };
        const userPhone = token.phone;
        //  lookup for the user data
        data.read("user", userPhone, (err, strUserData) => {
          if (!err && strUserData) {
            verifyToken(tokenId, userPhone, (validToken) => {
              if (validToken) {
                const user = { ...parseJSON(strUserData) };
                const userChecks =
                  typeof user.checks === "object" &&
                  user.checks instanceof Array
                    ? user.checks
                    : [];
                if (userChecks.length < maxChecks) {
                  const checkId = creatingRandomString(20);
                  const checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeoutSeconds,
                  };

                  // save the check object
                  data.create("checks", checkId, checkObject, (err) => {
                    if (!err) {
                      user.checks = userChecks;
                      user.checks.push(checkId);

                      // add the check id to the user's object and update it
                      data.update("user", userPhone, user, (err) => {
                        if (!err) {
                          callback(200, checkObject);
                        } else {
                          callback(500, {
                            error: "There is a problem in the server side!!!!",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        error: "There is a problem in the server side!!!!",
                      });
                    }
                  });
                } else {
                  callback(400, {
                    error: "You have reached at you max checks!!!!",
                  });
                }
              } else {
                callback(403, {
                  error: "Authentication Problem!!!!",
                });
              }
            });
          } else {
            callback(403, {
              error: "Authentication Problem! User cannot be found....",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication Problem! Token cannot be found....",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in Request",
    });
  }
};

// to handle check's get actions -> CRUD - Read
handler._check.get = (requestProperties, callback) => {
  //  verifying the credentials before reading
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    //  lookup for the check and get its user's phone number
    data.read("checks", id, (err, strCheck) => {
      if (!err && strCheck) {
        const checkObject = { ...parseJSON(strCheck) };
        const userPhone = checkObject.userPhone;
        //  Authentication - get token and match user's phone number
        //  get token Id
        const tokenId = requestProperties.headersObject.token;
        verifyToken(tokenId, userPhone, (validToken) => {
          if (validToken) {
            callback(200, checkObject);
          } else {
            callback(403, {
              error: "Authentication error!!!!",
            });
          }
        });
      } else {
        callback(403, {
          error: "Invalid Check Id inserted!!!!!",
        });
      }
    });
  } else {
    callback(500, {
      error: "You have a problem in your request",
    });
  }
};

// to handle check's put actions -> CRUD - Update
handler._check.put = (requestProperties, callback) => {
  //  verifying the credentials before reading
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;
  if (id) {
    //  lookup for the check and get its user's phone number
    data.read("checks", id, (err, strCheck) => {
      if (!err && strCheck) {
        const checkObject = { ...parseJSON(strCheck) };
        const userPhone = checkObject.userPhone;
        //  Authentication - get token and match user's phone number
        //  get token Id
        const tokenId = requestProperties.headersObject.token;
        verifyToken(tokenId, userPhone, (validToken) => {
          if (validToken) {
            // verifying inputs
            const protocol =
              typeof requestProperties.body.protocol === "string" &&
              ["http", "https"].indexOf(requestProperties.body.protocol) > -1
                ? requestProperties.body.protocol
                : false;

            const url =
              typeof requestProperties.body.url === "string" &&
              requestProperties.body.url.trim().length > 0
                ? requestProperties.body.url.trim()
                : false;

            const method =
              typeof requestProperties.body.method === "string" &&
              ["GET", "POST", "UPDATE", "DELETE"].indexOf(
                requestProperties.body.method
              ) > -1
                ? requestProperties.body.method
                : false;

            const successCodes =
              typeof requestProperties.body.successCodes === "object" &&
              requestProperties.body.successCodes instanceof Array
                ? requestProperties.body.successCodes
                : false;

            const timeoutSeconds =
              typeof requestProperties.body.timeoutSeconds === "number" &&
              requestProperties.body.timeoutSeconds % 1 === 0 &&
              requestProperties.body.timeoutSeconds >= 1 &&
              requestProperties.body.timeoutSeconds <= 5
                ? requestProperties.body.timeoutSeconds
                : false;
            if (protocol || url || method || successCodes || timeoutSeconds) {
              // checking and updating the fields
              if (protocol) checkObject.protocol = protocol;
              if (url) checkObject.url = url;
              if (method) checkObject.method = method;
              if (successCodes) checkObject.successCodes = successCodes;
              if (timeoutSeconds) checkObject.timeoutSeconds = timeoutSeconds;

              //  saving the updated check
              data.update("checks", id, checkObject, (err) => {
                if (!err) {
                  callback(200, checkObject);
                } else {
                  callback(500, {
                    error: "There is a problem in the server side!!!!!!",
                  });
                }
              });
            } else {
              callback(500, {
                error: "You have a problem in your request!!!!!!",
              });
            }
          } else {
            callback(403, {
              error: "Authentication error!!!!",
            });
          }
        });
      } else {
        callback(403, {
          error: "Invalid Check Id inserted!!!!!",
        });
      }
    });
  } else {
    callback(500, {
      error: "You have a problem in your request!!!!!!",
    });
  }
};

// to handle check's delete actions -> CRUD - Delete
handler._check.delete = (requestProperties, callback) => {
  //  verifying the credentials before reading
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    //  lookup for the check and get its user's phone number
    data.read("checks", id, (err, strCheck) => {
      if (!err && strCheck) {
        const checkObject = { ...parseJSON(strCheck) };
        const userPhone = checkObject.userPhone;
        //  Authentication - get token and match user's phone number
        //  get token Id
        const tokenId = requestProperties.headersObject.token;
        verifyToken(tokenId, userPhone, (validToken) => {
          if (validToken) {
            // deleting the check
            data.delete("checks", id, (err) => {
              if (!err) {
                // lookup for the user that has this check
                data.read("user", userPhone, (err, strUserData) => {
                  if (!err && strUserData) {
                    // removing the check from user's checks array
                    const userObject = { ...parseJSON(strUserData) };
                    const index = userObject.checks.indexOf(id);
                    if (index > -1) {
                      userObject.checks.splice(index, 1);
                      //  now updating the updated user
                      data.update("user", userPhone, userObject, (err) => {
                        if (!err) {
                          callback(200, userObject);
                        } else {
                          callback(500, {
                            error:
                              "There is a problem in the server side!!!!!!",
                          });
                        }
                      });
                    } else {
                      callback(403, {
                        error: "Can't find the check id in user's checks!!!!!!",
                      });
                    }
                  } else {
                    callback(403, {
                      error: "Can't find user!!!!!!",
                    });
                  }
                });
              } else {
                callback(500, {
                  error:
                    "Can't delete check. There is a problem in the server side!!!!!!",
                });
              }
            });
          } else {
            callback(403, {
              error: "Authentication error!!!!",
            });
          }
        });
      } else {
        callback(403, {
          error: "Invalid Check Id inserted!!!!!",
        });
      }
    });
  } else {
    callback(500, {
      error: "You have a problem in your request",
    });
  }
};

module.exports = handler;
