/**
 * Title: Worker Library
 * Description: Worker Related Files and Functions
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 06/02/2022
 */

//=>Dependencies
const url = require("url");
const data = require("./data");
const { parseJSON } = require("../helpers/utilities");
const http = require("http");
const https = require("https");
const { sendTwilioSms } = require("../helpers/notifications");

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

// perform checking of the given check input
worker.performCheck = (checkObject) => {
  // prepare the initial outcome
  const checkOutcome = {
    error: false,
    value: false,
  };

  //mark the outcome has not been sent yet
  let outcomeSent = false;

  //  parse the host name and full url from the check object's data
  const parsedUrl = url.parse(
    `${checkObject.protocol}://${checkObject.url}`,
    true
  );
  const hostname = parsedUrl.hostname;
  const path = parsedUrl.path;

  //  constructing the request
  /*
   * here we are constructing the object to be sent with request
   * timeout - in ms
   */
  const requestDetails = {
    protocol: `${checkObject.protocol}:`,
    hostname,
    method: checkObject.method,
    path,
    timeout: checkObject.timeoutSeconds * 1000,
  };

  const protocolToUse = checkObject.protocol === "http" ? http : https;

  const req = protocolToUse.request(requestDetails, (res) => {
    //  grab the status code
    const status = res.statusCode;

    //  update the check outcome and pass to the next process
    if (!outcomeSent) {
      checkOutcome.value = status;
      worker.processCheckOutcome(checkObject, checkOutcome);
      outcomeSent = true;
    }
  });

  // checking if any error occurs during response
  req.on("error", (err) => {
    //  update the check outcome and pass to the next process
    if (!outcomeSent) {
      checkOutcome.error = true;
      checkOutcome.value = err;
      worker.processCheckOutcome(checkObject, checkOutcome);
      outcomeSent = true;
    }
  });

  //  checking if timeout happens
  req.on("timeout", () => {
    //  update the check outcome and pass to the next process
    if (!outcomeSent) {
      checkOutcome.error = true;
      checkOutcome.value = "timeout";
      worker.processCheckOutcome(checkObject, checkOutcome);
      outcomeSent = true;
    }
  });

  // ending the request
  req.end();
};

// save the check outcome to the database and send to next process
worker.processCheckOutcome = (checkObject, checkOutcome) => {
  // check if the check outcome is up or down
  const state =
    !checkOutcome.error &&
    checkOutcome.value &&
    checkObject.successCodes.indexOf(checkOutcome.value) > -1
      ? "up"
      : "down";

  //  decide weather to send alert or not

  const alertWanted = checkObject.lastChecked && checkObject.state !== state;

  checkObject.state = state;
  checkObject.lastChecked = Date.now();

  // update the check data into file system
  data.update("checks", checkObject.id, checkObject, (err) => {
    if (!err) {
      if (alertWanted) {
        //  send the check data to the next process
        worker.alertUserToStatusChange(checkObject);
      } else {
        console.log("Alert not needed as there is no state change...");
      }
    } else {
      console.log(
        "Error: trying to save check data of one of the checks!!!!!!"
      );
    }
  });
};

// send notification sms to user if state changed
worker.alertUserToStatusChange = (checkObject) => {
  //  creating the sms
  const msg = `Alert: Your check for ${checkObject.method} ${checkObject.protocol}://${checkObject.url} is currently ${checkObject.state}`;
  sendTwilioSms(checkObject.userPhone, msg, (err) => {
    if (!err) {
      console.log(`User is alerted to a status change via SMS: ${msg}`);
    } else {
      console.log(
        "Error: There was a problem sending sms to one of the user!!!"
      );
      console.log(err);
    }
  });
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
