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

const { sendTwilioSms } = require("./helpers/notifications");

//=>App Object - Module Scaffolding
const app = {};

// //=>Configuration
// app.config = {
//     port: 3030
// }

// testing Twilio
// @TODO: delete it later
sendTwilioSms("01842626668", "Hello World", (err) => {
  console.log("there is the error ", err);
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
