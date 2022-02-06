/**
 * Title: Project's Initial File
 * Description: Initial File To Start The Node Server and Worker
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 06/02/2022
 */

//=>Dependencies
const server = require("./lib/server");
const worker = require("./lib/worker");

//=>App Object - Module Scaffolding
const app = {};

// Initializing server and worker
app.init = () => {
  // start the server
  server.init();
  // start the workers
  worker.init();
};

app.init();

// export the app
module.exports = app;
