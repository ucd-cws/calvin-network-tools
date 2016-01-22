'use strict';

var fs = require('fs');

// stupid node.
function fileExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = {
  fileExistsSync : fileExistsSync,
  getUserHome : getUserHome
};
