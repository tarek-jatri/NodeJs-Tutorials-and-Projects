/**
 * Title: Handle Req Res
 * Description: Handle Request & Response
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 31/01/2022
 */


//=>Dependencies
// url module to get & parse url request data
const url = require('url');
// String Decoder module to read data from request body
const { StringDecoder } = require('string_decoder')

//=>App Object - Module Scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
    // request handling 
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/$/, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;

    // reading and decoding data from request body
    const decoder = new StringDecoder('utf-8');
    let realData = '';
    // reading data from body using stream-buffer 
    // and saving it on a variable

    // the 'data' event keeps firing until the reading stream ends reading data
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });
    // the 'end' event is fired when the reading ends and then we need to stop the decoder
    req.on('end', () => {
        realData += decoder.end();

        console.log(realData);
        // response handling
        res.end('Hello Peter!!! How are you????');
    });
}

module.exports = handler;