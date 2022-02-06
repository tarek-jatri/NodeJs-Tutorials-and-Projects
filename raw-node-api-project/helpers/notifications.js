/**
 * Title: Notifications Library
 * Description: Important functions to notify users
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 06/02/2022
 */

//=>Dependencies
const https = require("https");
const querystring = require("querystring");
const { twilio } = require("./environments");

//=> Module Scaffolding
const notifications = {};

// send sms to user using twilio api
notifications.sendTwilioSms = (phone, msg, callback) => {
  // verify inputs
  const userPhone =
    typeof phone === "string" && phone.trim().length === 11
      ? phone.trim()
      : false;
  const userMsg =
    typeof msg === "string" &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg.trim()
      : false;
  if (userMsg && userMsg) {
    // configure the request payload
    const payload = {
      From: twilio.fromPhone,
      To: `+88${userPhone}`,
      Body: userMsg,
    };
    //  stringify the payload using nodejs
    const stringifyPayload = querystring.stringify(payload);

    // console.log(stringifyPayload);

    // configure the request details
    const requestDetails = {
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
      auth: `${twilio.accountSid}:${twilio.authToken}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    // console.log(requestDetails);

    //  instantiate the request object
    const req = https.request(requestDetails, (res) => {
      // get the status of the send request
      const status = res.statusCode;
      // callback successfully if the request went through
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`Status code returned was ${status} ${res.statusMessage}`);
      }
    });

    // error handling
    req.on("error", (e) => {
      callback(e);
    });

    req.write(stringifyPayload);
    req.end();
  } else {
    callback("Given parameters were missing or invalid!!!!");
  }
};

// export the module
module.exports = notifications;
