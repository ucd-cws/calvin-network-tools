'use strict';

var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var utils = require('../lib/utils');


var runtimePath = path.join(__dirname, '..','..','HEC_Runtime');
var tmpPath = path.join(utils.getUserHome(),'.HEC_Runtime');
var moved = false;

module.exports = function(callback) {
  moveHome();

  if( !moved ) {
    console.log('Failed to move runtime.  Please run "cnf library init"');
  }

  console.log('Updating via npm');
  exec('npm install -g calvin-network-tools', {},
    function (error, stdout, stderr) {
      if( error ) {
        console.log(error);
      }
      if( stderr ) {
        console.log(stderr);
      }
      if( stdout ) {
        console.log(stdout);
      }

      if( moved ) {
        try {
          console.log('Copying runtime back');
          fs.renameSync(tmpPath, runtimePath);
          console.log('Update complete.');
          callback();
        } catch(e) {
          console.log('Failed to move runtime.  Please run "cnf library init"');
          console.log(e);
        }
      }
    }
  );
}


function moveHome() {
  try {
    if( utils.fileExistsSync(runtimePath) ) {
      if( !utils.fileExistsSync(tmpPath) ) {
        console.log('Attempting to move runtime');
        fs.renameSync(runtimePath, tmpPath);
      }
      moved = true;
    }
  } catch(e) {
    console.log('Failed to stash runtime in home dir, attempting parent');
    moveUp();
  }
}

function moveUp() {
  try {
    tmpPath = path.join(__dirname, '..', '..','..','.HEC_Runtime');
    if( utils.fileExistsSync(runtimePath) ) {
      if( !utils.fileExistsSync(tmpPath) ) {
        console.log('Attempting to move runtime, again');
        fs.renameSync(runtimePath, tmpPath);
      }
      moved = true;
    }
  } catch(e) {}
}
