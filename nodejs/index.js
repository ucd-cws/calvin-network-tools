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

function onReady() {
  // assume extra commands are the are nodes for show/list command
  program.nodes = [];
  for( var i = 0; i < program.args.length; i++ ) {
    if( typeof program.args[i] === 'string' ) {
      program.nodes.push(program.args[i]);
    }
  }
  // read arguments from config file;
  fileConfig(program);

  // stash program arguments.
  require('./config').set(program);

  // dump all args if user wants
  if( program.verbose ) {
    console.log('*** CNF Arguments ***');
    for( var key in program ) {
      var type = typeof program[key];
      if( type === 'string' || type === 'boolean' ) {
        console.log('  '+key+': '+program[key]);
      }
    }
    console.log('**********************\n');
  }

  checkVersion(function(){
    var cmd = program.args[program.args.length-1]._name;
    run(cmd);
    
    // done with all cmds
    if( program.verbose ) {
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