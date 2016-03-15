'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function(cmd, callback) {
  var config = require('./config').get();

  // check for init command.
  if( cmd === 'init' ) {
    require('./init.js');
    return callback();
  }

  if( cmd === 'update-library' ) {
    require('./updateLibrary');
    return;
  }

  // check for link, we are using node module for link commands
  if( cmd === 'show' ) {
    cmd = 'node';
    config.nodeCmdType = 'show';
  } else if( cmd === 'list' ) {
    cmd = 'node';
    config.nodeCmdType = 'list';
  } else if( cmd === 'show-build' ) {
    cmd = 'showBuild';
  }

  var modulePath = path.join(__dirname, 'cmds', cmd+'.js');
  var modulePathDir = path.join(__dirname, 'cmds', cmd+'/index.js');



  require(path.join(__dirname, 'cmds', cmd))(callback);
};
