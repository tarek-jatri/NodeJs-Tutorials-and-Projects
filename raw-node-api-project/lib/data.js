/**
 * Title: Data
 * Description: Data storage in file system
 * Author: Tarek Jatri (Intern Backend NodeJs Developer)
 * Date: 31/01/2022
 */

//=>Dependencies
const fs = require("fs");
const path = require("path");

//=>Module Scaffolding
const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, "/../.data/");

// write data to file -> CRUD - Create
lib.create = (dir, file, data, callback) => {
  // open file for writing
  fs.open(`${lib.basedir}${dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    // checking if there is any error or not
    if (!err && fileDescriptor) {
      //convert data to string
      const dataString = JSON.stringify(data);
      // write data to file and then close it
      fs.writeFile(fileDescriptor, dataString, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback("Error closing the new file");
            }
          });
        } else {
          callback("Error writing to the new file");
        }
      });
    } else {
      callback("The file has already been created!!!");
    }
  });
};

// read data from file -> CRUD - Read
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir}${dir}/${file}.json`, "utf-8", (err, data) => {
    callback(err, data);
  });
};

// update data from file -> CRUD - Update
lib.update = (dir, file, data, callback) => {
  //  opening a file for updating
  fs.open(`${lib.basedir}${dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          // converting data into string
          const dataString = JSON.stringify(data);
          fs.writeFile(fileDescriptor, dataString, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback("Error in closing file for updating...");
                }
              });
            } else {
              callback("Error in updating the file...");
            }
          });
        } else {
          callback("Error in truncating file for updating...");
        }
      });
    } else {
      callback("Error in opening file for updating...");
    }
  });
};

// deleting an existing file -> CRUD - Delete
lib.delete = (dir, file, callback) => {
  // unlinking file
  fs.unlink(`${lib.basedir}${dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error in deleting file!!!!!");
    }
  });
};

// exporting the lib
module.exports = lib;
