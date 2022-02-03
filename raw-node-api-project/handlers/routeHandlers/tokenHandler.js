/**
 * Title: Token Handler
 * Description: Handler to handle token related routes
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 03/02/2022
 */

//=>Dependencies
const data = require("../../lib/data");
const { parseJSON } = require("../../helpers/utilities");
const { hash } = require("../../helpers/utilities");
const { creatingRandomString } = require("../../helpers/utilities");

//=>Module Scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

/**
 * this is a scaffolding for handling the methods action to token route
 * here we used scaffolding _token to say that it's a private property
 */
handler._token = {};

// to handle token's post actions -> CRUD - Create
handler._token.post = (requestProperties, callback) => {
  // verifying the credentials before creating
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

  // checking if they are ok or not and sending error
  if (phone && password) {
    data.read("user", phone, (err, user) => {
      if (!err) {
        const hashedPassword = hash(password);
        const userData = { ...parseJSON(user) };
        // console.log(">>>>>>>> ", hashedPassword, userData.password);
        if (hashedPassword === userData.password) {
          // generating a token
          const tokenId = creatingRandomString(20);
          // As Date.now() returns in ms, so converting 1 hour into ms
          const expires = Date.now() + 60 * 60 * 1000;
          // the token object to be created
          const tokenObject = {
            phone,
            id: tokenId,
            expires,
          };

          //  store the token
          data.create("tokens", tokenId, tokenObject, (err) => {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, {
                error: "There is a problem in server side!!!",
              });
            }
          });
        } else {
          callback(400, {
            error: "Password doesn't match!!!!!",
          });
        }
      } else {
        callback(400, {
          error: "Phone or password is not found!!!",
        });
      }
    });
  } else {
    callback(400, {
      error: "Invalid phone or password!!!",
    });
  }
};

// to handle token's get actions -> CRUD - Read
handler._token.get = (requestProperties, callback) => {
  //  verifying the credentials before reading
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    //  lookup for the token information
    data.read("tokens", id, (err, strToken) => {
      if (!err && strToken) {
        const token = { ...parseJSON(strToken) };
        callback(200, token);
      } else {
        callback(400, {
          error: "Token cannot be found!!!",
        });
      }
    });
  } else {
    callback(400, {
      error: "Invalid token!!!",
    });
  }
};

// to handle token's put actions -> CRUD - Update
handler._token.put = (requestProperties, callback) => {
  // verifying the credentials before creating
  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
      ? requestProperties.body.extend
      : false;
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;
  if (extend && id) {
    data.read("tokens", id, (err, strToken) => {
      if (!err) {
        const token = { ...parseJSON(strToken) };
        /**
         * checking if the token is already expired or not
         * if not expired then extending the time
         */
        if (token.expires > Date.now()) {
          // extending the token time
          token.expires = Date.now() + 60 * 60 * 1000;
          //  updating the token
          data.update("tokens", id, token, (err) => {
            if (!err) {
              callback(200, token);
            } else {
              callback(500, {
                error: "There is a problem in the server side!!!",
              });
            }
          });
        } else {
          callback(400, {
            error: "Token is already expired!!!!",
          });
        }
      } else {
        callback(400, {
          error: "Token cannot be found!!!!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There is a problem in the request!!!",
    });
  }
};

// to handle token's delete actions -> CRUD - Delete
handler._token.delete = (requestProperties, callback) => {
  //  verifying the credentials before reading
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    //  lookup for the token information
    data.read("tokens", id, (err, strToken) => {
      if (!err && strToken) {
        data.delete("tokens", id, (err) => {
          if (!err) {
            callback(200, {
              message: `${id} token has been deleted....`,
            });
          } else {
            callback(500, {
              error: "There is a problem in the server side!!!",
            });
          }
        });
      } else {
        callback(400, {
          error: "Token cannot be found!!!",
        });
      }
    });
  } else {
    callback(400, {
      error: "Invalid token!!!",
    });
  }
};

// to verify token with user's information
handler.verifyToken = (id, phone, callback) => {
  //  verifying the credentials before reading
  const tokenId =
    typeof id === "string" && id.trim().length === 20 ? id : false;
  if (tokenId && phone) {
    //  lookup for the token
    data.read("tokens", tokenId, (err, strToken) => {
      if (!err && strToken) {
        const token = { ...parseJSON(strToken) };
        if (phone === token.phone && token.expires > Date.now()) {
          callback(true);
        } else {
          callback(false);
        }
      } else {
        callback(false);
      }
    });
  } else {
    callback(false);
  }
};

module.exports = handler;
