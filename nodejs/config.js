'use strict';

// stash the commander object for global use
var config;

module.exports = {
  get : function() {
    return config;
  },
  set : function(commander) {
    config = commander;    
    commander.args.forEach(mergeSubCommandOptions);
  }
};

function mergeSubCommandOptions(arg) {
  if( typeof arg === 'string' ) {
    return;
  }
  
  for( var key in arg ) {
    if( key.match(/^_/) ) continue;
    if( typeof arg[key] !== 'string' ) continue;
    config[key] = arg[key];
  }
}