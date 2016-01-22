'use strict';

var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var utils = require('./lib/utils');


var runtimePath = path.join(__dirname, '..','..','HEC_Runtime');
var tmpPath = path.join(utils.getUserHome(),'.HEC_Runtime');
var moved = false;

if( utils.fileExistsSync(runtimePath) ) {
  if( !utils.fileExistsSync(tmpPath) ) {
    console.log('Moving runtime');
    fs.renameSync(runtimePath, tmpPath);
  }
  moved = true;
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
      } catch(e) {
        console.log('Failed to move runtime.  Please run "prm init"');
        console.log(e);
      }
    }
  }
);
