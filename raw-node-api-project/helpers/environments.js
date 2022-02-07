/**
 * Title: Environments
 * Description: Handle all environment related things
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 31/01/2022
 */

//=>Dependencies

//=>Module Scaffolding
const environments = {};
// Defining environment variables for different environments
environments.staging = {
  port: 3030,
  envName: "staging",
  secretKey: "AbirHossain",
  maxChecks: 5,
  twilio: {
    fromPhone: "+19088276222",
    accountSid: "AC330faa4d62529186be4e15ecef59dfda",
    authToken: "7af2d2fd02fded8cdeee50f3a39bb3d9",
  },
};

environments.production = {
  port: 4000,
  envName: "production",
  secretKey: "Md.ArifulIslamTarek",
  maxChecks: 5,
  twilio: {
    fromPhone: "+19088276222",
    accountSid: "AC330faa4d62529186be4e15ecef59dfda",
    authToken: "7af2d2fd02fded8cdeee50f3a39bb3d9",
  },
};

// Determining which environment was passed as variable
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";
/**
 * Exporting corresponding environment
 * We are checking error with typeof so that
 * we can handle the error properly
 */

const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;
module.exports = environmentToExport;
