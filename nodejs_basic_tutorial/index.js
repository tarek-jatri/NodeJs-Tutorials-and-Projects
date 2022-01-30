/*
---------------------------------------------------
Path Module
---------------------------------------------------

const path  = require('path');
const myPath = 'C:\\Users\\Tarek\\WebstormProjects\\nodejs_basic_tutorial\\index.js';
console.log(path.parse(myPath));
*/

/*
---------------------------------------------------
OS Module
---------------------------------------------------
const os = require('os');

console.log(os.platform());
*/


/*
---------------------------------------------------
File Module
---------------------------------------------------
*/
/*
// File Operation by Synchronous
const fs = require('fs');
fs.appendFileSync('myfile.txt', 'Hello World');
fs.appendFileSync('myfile.txt', ' Hello Programmers');
const data = fs.readFileSync('myfile.txt');
console.log(data.toString());
*/
/*
// File Operation by Asynchronous
const fs = require('fs');
fs.readFile('myfile.txt', (err, data) => {
    console.log(data.toString());
});
console.log('Hello');
 */


/*
---------------------------------------------------
Event Module
---------------------------------------------------
*//*
// Events and event parameter
const EventEmitter = require('events');
const emitter = new EventEmitter();

// registering a listener for bellRing event
emitter.on('bellRing', ({period, text}) => {
    console.log(`We need to run ${period} ${text}...`);
});
// raising an event
emitter.emit('bellRing', {
    period: 'first',
    text: 'period ended'
});
*/

//Extending Events
const School = require('./school');
const school = new School();

school.on('bellRing', ({period, text})=>{
    console.log(`The ${period} is ended... So,  ${text}`);
});

school.startPeriod();