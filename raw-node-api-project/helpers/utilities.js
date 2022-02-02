/**
 * Title: Utilities
 * Description: Important utility function
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 31/01/2022
 */

//=>Dependencies
const crypto = require("crypto");
const environment = require("./environments");

//=>Module Scaffolding
const utilities = {};

// parse JSON string to object
utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};

// hashing string
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHash("sha256", environment.secretKey)
      .update(str)
      .digest("hex");
    return hash;
  }
  return false;
};

module.exports = utilities;
