/**
 * Title: Sample Handler
 * Description: Handle Request to Sample
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 31/01/2022
 */

//=>Module Scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  console.log(requestProperties);
  callback(200, {
    message: "This is sample Handler",
  });
};

module.exports = handler;
