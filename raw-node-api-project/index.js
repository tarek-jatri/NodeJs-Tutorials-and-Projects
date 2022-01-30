/**
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or downtime of user defined links
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 30/01/2022
 *
 */

//=>Dependencies
const http = require('http');

//=>App Object - Module Scaffolding
const app = {};

//=>Configuration
app.config = {
    port: 3030
}

//=>Create Server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Listening to port ${app.config.port}`);
    });
};

//=>handle Request Response of Server
app.handleReqRes = (req, res) => {
    // response handle
    res.end('Hello Peter!!! How are you????');
}

// start the server
app.createServer();