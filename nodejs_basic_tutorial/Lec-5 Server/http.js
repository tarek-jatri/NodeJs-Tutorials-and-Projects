const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.write("YoYo Chiki Chiki");
        res.write("Disting Disting Mama");
        res.end();
    } else if( req.url === '/about'){
        res.write(`Hey, how u doin???`);
        res.end();
    } else {
        res.write(`Not FOUND`);
        res.end();
    }
});
server.listen(1000);
console.log('Listening to port 1000');
