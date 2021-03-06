/**
 * Title: Routes
 * Description: Application Routes
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 01/02/2022
 */

//=>Dependencies
/**
 * Here we are importing the functions that would be called
 * if we hit/send request for a particular URL.
 */
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
const { checkHandler } = require("./handlers/routeHandlers/checkHandler");

//=> App Object - Module Scaffolding
/**
 * Here we are setting the functions to be called against a URL
 */
const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};

module.exports = routes;
