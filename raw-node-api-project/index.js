/**
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or downtime of user defined links
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 30/01/2022
 */

//=>Dependencies
// http module to create server
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
// importing environment variables
const environment = require("./helpers/environments");
// importing the data CRUD library
const data = require("./lib/data");

//=>App Object - Module Scaffolding
const app = {};

// //=>Configuration
// app.config = {
//     port: 3030
// }

// testing file system
// @TODO: delete it later
data.delete("test", "newFile", (err) => {
  console.log(err);
});

//=>Create Server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`Listening to port ${environment.port}`);
  });
};

//=>handle Request Response of Server
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
