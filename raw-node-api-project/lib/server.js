/**
 * Title: Server Library
 * Description: Server Related Files and Functions
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 06/02/2022
 */

//=>Dependencies
// http module to create server
const http = require("http");
const { handleReqRes } = require("../helpers/handleReqRes");
// importing environment variables
const environment = require("../helpers/environments");

//=>server Object - Module Scaffolding
const server = {};

//=>Create Server
server.createServer = () => {
  const createServerVariable = http.createServer(server.handleReqRes);
  createServerVariable.listen(environment.port, () => {
    console.log(`Listening to port ${environment.port}`);
  });
};

//=>handle Request Response of server
server.handleReqRes = handleReqRes;

// start the server
server.init = () => {
  server.createServer();
};

// exporting the server
module.exports = server;
