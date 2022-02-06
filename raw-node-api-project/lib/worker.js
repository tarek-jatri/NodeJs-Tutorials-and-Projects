/**
 * Title: Worker Library
 * Description: Worker Related Files and Functions
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 06/02/2022
 */

//=>Dependencies
const data = require("./data");
const { parseJSON } = require("../helpers/utilities");

//=>worker Object - Module Scaffolding
const worker = {};

// lookup all the checks
worker.gatherAllChecks = () => {
  // get all the checks
  data.list("checks", (err, checks) => {
    if (!err && checks && checks.length) {
      // loop all the checks to read data of checks
      checks.forEach((check) => {
        data.read("checks", check, (err, strCheckData) => {
          if (!err && strCheckData) {
            worker.validateCheckData(parseJSON(strCheckData));
          } else {
            console.log(`Error: reading the data of check id: ${check}`);
          }
        });
      });
    } else {
      console.log("Error: could not find any check to process!!!");
    }
  });
};

// validating individual check data
worker.validateCheckData = (checkObject) => {
  if (checkObject && checkObject.id) {
    checkObject.state =
      typeof checkObject.state === "string" &&
      ["up", "down"].indexOf(checkObject.state) > -1
        ? checkObject.state
        : "down";

    checkObject.lastChecked =
      typeof checkObject.lastChecked === "number" && checkObject.lastChecked > 0
        ? checkObject.lastChecked
        : false;

    //  pass to the next process
    worker.performCheck(checkObject);
  } else {
    console.log("Error: check was invalid or not properly formatted!!!");
  }
};

// perform checking
worker.performCheck = (checkObject) => {
  //  parse the
};

// timer to execute the worker process once per minute
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllChecks();
  }, 1000 * 60);
};

// start the worker
worker.init = () => {
  // execute all the checks
  worker.gatherAllChecks();

  // call the loop so that checking continues
  worker.loop();
};

// exporting the server
module.exports = worker;
