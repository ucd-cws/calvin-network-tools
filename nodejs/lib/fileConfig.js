'use strict';

var fs = require('fs');
var path = require('path');
var CONFIG_NAME = '.prmconf';

/**
 * Store basic calvin prm in home directory
 **/
module.exports = function(program) {
  if( !program.c || !program.config ) return;
  readConfig(path.join(program.c || program.config, CONFIG_NAME), program);
};

function readConfig(path, program) {
  if( !fs.existsSync(path) ) {
    if( program.verbose ) {
      console.warn(`No config file found at: ${path}`);
    }
    return;
  }

  var config;
  try {
    config = JSON.parse(fs.readFileSync(path, 'utf-8'));
  } catch(e) {
    console.log('Failed to import config: '+path);
    console.log(e);
    process.exit(-1);
  }

  for( var key in config ) {
    if( program[key] === undefined ) {
      program[key] = config[key];
    }
  }
}