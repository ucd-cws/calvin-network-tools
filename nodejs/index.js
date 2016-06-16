'use strict';

var program = require('commander');
var sprintf = require('sprintf-js').sprintf;
var async = require('async');

var fileConfig = require('./lib/fileConfig');
var checkVersion = require('./lib/checkVersion');
var run = require('./run');

program
  .version(require('../package.json').version)
  .option('-v, --verbose', 'Verbose output, including hec-dss library output')

function onReady(env) {

  // assume extra commands are the are nodes for show/list command
  env.nodes = [];
  for( var i = 0; i < env._args.length; i++ ) {
    if( typeof env._args[i] === 'string' ) {
      env.nodes.push(env._args[i]);
    }
  }
  // read arguments from config file;
  fileConfig(env);

  // stash program arguments.
  require('./config').set(env);

  // dump all args if user wants
  if( env.verbose ) {
    console.log('*** CNF Arguments ***');
    for( var key in env ) {
      var type = typeof env[key];
      if( type === 'string' || type === 'boolean' ) {
        console.log('  '+key+': '+env[key]);
      }
    }
    console.log('**********************\n');
  }

  checkVersion(function(){
    debugger;
    var cmd = env._name;
    run(cmd);
    
    // done with all cmds
    if( env.verbose ) {
      console.log('\nPRM COMPLETE');
    }
  });
}

// register Commander command definitions 
require('./cmds/register')(program, onReady);

// default, dump help and quit
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
  
// actually parse the args
program.parse(process.argv);