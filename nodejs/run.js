'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function(cmd, callback) {
   if( !callback ) {
     callback = function() {}
   }
  
  var config = require('./config').get();

  // check for init command.
  if( cmd === 'init' ) {
    require('./cmds/init.js');
    return callback();
  }

  if( cmd === 'update-library' ) {
    require('./cmds/updateLibrary');
    return;
  }

  // check for link, we are using node module for link commands
  if( cmd === 'show' ) {
    cmd = 'showOrList';
    config.nodeCmdType = 'show';
  } else if( cmd === 'list' ) {
    cmd = 'showOrList';
    config.nodeCmdType = 'list';
  } else if( cmd === 'show-build' ) {
    cmd = 'showBuild';
  }

    
  var modulePath = path.join(__dirname, 'cmds', cmd+'.js');
  var modulePathDir = path.join(__dirname, 'cmds', cmd+'/index.js');



  require(path.join(__dirname, 'cmds', cmd))(callback);
};
