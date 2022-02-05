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
                    timeoutSeconds
                  }

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
                            error: "There is a problem in the server side!!!!"
                          });

                        }
                      });

                    } else {
                      callback(500, {
                        error: "There is a problem in the server side!!!!"
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
handler._check.get = (requestProperties, callback) => { };

// to handle check's put actions -> CRUD - Update
handler._check.put = (requestProperties, callback) => { };

// to handle check's delete actions -> CRUD - Delete
handler._check.delete = (requestProperties, callback) => { };

module.exports = handler;
