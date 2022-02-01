/**
 * Title: Handle Req Res
 * Description: Handle Request & Response
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 31/01/2022
 */

//=>Dependencies
// url module to get & parse url request data
const url = require("url");
// String Decoder module to read data from request body
const { StringDecoder } = require("string_decoder");
// Importing the routes for function call and others
const routes = require("../routes");
const { notFoundHandler } = require("../routeHandlers/notFoundHandler");

//=>App Object - Module Scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  // request handling
  // get the url and parse it
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;
  const headersObject = req.headers;
  /**
   * this requestProperties variable is used to send
   * the request properties to the handler functions
   */
  const requestProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headersObject,
  };
  // getting the handler function to be called
  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;
  /**
   * here we are calling the handler function and sending
   * the requestProperties and a callback as parameter.
   * The callback function is used to get a return/response
   * from handler function with statusCode and payload.
   * Payload is the response data of the handler function.
   */
  chosenHandler(requestProperties, (statusCode, payload) => {
    // checking if the statusCode and payload are sent properly
    statusCode = typeof statusCode === "number" ? statusCode : 500;
    payload = typeof payload === "object" ? payload : {};
    // converting payload object to string for sending on the response
    const payloadString = JSON.stringify(payload);
    /**
     * writing status code on the response header for a
     * successful operation of request and response.
     * Return the final response
     */
    res.writeHead(statusCode);
    // sending the payload
    res.end(payloadString);
  });

  // reading and decoding data from request body
  const decoder = new StringDecoder("utf-8");
  let realData = "";
  // reading data from body using stream-buffer
  // and saving it on a variable

  // the 'data' event keeps firing until the reading stream ends reading data
  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });
  // the 'end' event is fired when the reading ends and then we need to stop the decoder
  req.on("end", () => {
    realData += decoder.end();

    console.log(realData);
    // response handling
    res.end("Hello Peter!!! How are you????");
  });
};

module.exports = handler;