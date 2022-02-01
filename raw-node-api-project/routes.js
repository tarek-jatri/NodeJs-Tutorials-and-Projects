/**
 * Title: Routes
 * Description: Application Routes
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 01/02/2022
 */

//=>Dependencies
/**
 * Here we are importing the functions that would be called
 * if we hit/send request for a particular URL.
 */
const {sampleHandler} = require('./routeHandlers/sampleHandler');

//=> App Object - Module Scaffolding
/**
 * Here we are setting the functions to be called against a URL
 */
const routes = {
    sample: sampleHandler,
};

module.exports = routes;