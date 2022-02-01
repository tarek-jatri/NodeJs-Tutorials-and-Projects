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
};

environments.production = {
  port: 4000,
  envName: "production",
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
