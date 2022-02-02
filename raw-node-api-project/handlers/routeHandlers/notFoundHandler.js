/**
 * Title: Not Found Handler
 * Description: Handle request that's not found - error 404
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 31/01/2022
 */

//=>App Object - Module Scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  console.log(requestProperties);
  callback(404, {
    message: "Your requested URL is not found!!!",
  });
};

module.exports = handler;
