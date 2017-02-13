/**
 * Do so pre-processing before we run any command
 */
var path = require('path');
var fileConfig = require('../nodejs/lib/fileConfig');
var checkVersion = require('../nodejs/lib/checkVersion');
var config = require('../nodejs/config');

var cmdModuleMap = {
  list : 'showOrList',
  show : 'showOrList',
  update : 'updateLibrary'
}

module.exports = function(argv) {
  // read arguments from config file;
  fileConfig(argv);

  var cmdsArray = argv._.slice(0);
  var cmd = cmdsArray.pop();

  // stash program arguments.
  config.set(argv);

  // dump all args if user wants
  if( argv.verbose ) {
    console.log('\n*** '+cmd+' Input Parameters ***');
    console.log(JSON.stringify(argv,'  ', '  '));
    console.log('**********************\n');
  }

  if( cmd === 'show' ) {
    config.set({nodeCmdType : 'show'});
  } else if( cmd === 'list' ) {
    config.set({nodeCmdType : 'list'});
  }

  checkVersion(function(){
    runCommand(cmd, argv);
  });
}

function runCommand(cmd, argv) {
  if( cmdModuleMap[cmd] ) {
    cmd = cmdModuleMap[cmd];
  }

  require(`../nodejs/cmds/${cmd}`)(() => {
    if( argv.verbose ) {
      console.log('Done.');
    }
  });
}