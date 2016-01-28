'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function(cmd, argv, docsUrl, callback) {
  // check for init command.
  if( cmd === 'init' ) {
    require('./init.js');
    return callback();
  }

  if( cmd === 'update-library' ) {
    require('./updateVersion');
    return;
  }

  // check for link, we are using node module for link commands
  if( cmd === 'show' ) {
    cmd = 'node';
    argv.show = true;
  } else if( cmd === 'list' ) {
    cmd = 'node';
    argv.list = true;
  }

  // load config file
  require('./lib/fileConfig')(argv);

  // check for show pd, ts or el
  /*if( cmd === 'pd' || cmd === 'ts' || cmd === 'el' ) {
    var type = cmd;
    if( argv._.length === 0 ) {
      console.log('You need to supply a command for the '+type+' module. options: [list | show | add]');
      return callback();
    }

    var cmd = argv._.splice(0, 1)[0];
    if( cmd === 'show' ) {
      return require('./cmds/showBuild')(type, argv, callback);
    } else {
      console.log('Invalid command for '+type+': '+cmd+'.\nSee docs here '+docsUrl);
      return callback();
    }
  }*/

  var modulePath = path.join(__dirname, 'cmds', cmd+'.js');

  if( !fs.existsSync(modulePath) ) {
    console.log('Invalid command: '+cmd+'.\nSee docs here '+docsUrl);
    return callback();
  }

  require(modulePath)(argv, callback);
};
