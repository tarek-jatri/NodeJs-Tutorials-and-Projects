
/*
* -----------------------------------
* Read Stream - Incoming Request
* -----------------------------------
*/

const http = require('http');
const server = http.createServer((req, res) => {
    if (req.url === '/'){
        res.write(`<html lang="en"><head><title>Document</title></head>`);
        res.write(`<body><form method="post" action="/process"><input name="message" /></form></body>`)
        res.end();
    } else if (req.url === '/process' && req.method === 'POST') {
        const body = [];
        req.on('data', (chunk)=>{
            body.push(chunk);
        });
        req.on('end', () =>{
            console.log('Straming is finished');
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody);
            res.write('This is post page');
            res.end();
        });

    }
});

server.listen(1212);
console.log('Server listening to port 1212');
