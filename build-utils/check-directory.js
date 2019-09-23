const fs = require('fs');

function checkDirectory (directory, callback) {
  fs.stat(directory, function(err, stats) {
    // Check if error defined and the error code is "not exists"
    if (err && err.errno === -2) {
      // Create the directory, call the callback.
      fs.mkdir(directory, callback);
    } else {
      // Just in case there was a different error:
      callback(err)
    }
  });
}

module.exports = checkDirectory;
