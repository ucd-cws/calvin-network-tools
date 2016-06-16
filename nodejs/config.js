'use strict';

// stash the commander object for global use
var config;

module.exports = {
  get : function() {
    return config;
  },
  set : function(commander) {
    config = commander;   

    mergeParent(commander);
    //commander.args.forEach(mergeSubCommandOptions);
  }
};

function mergeParent(env) {
  if( !env.parent ) {
    return;
  }

  for( var key in env.parent ) {
    if( key[0] === '_' ) continue;
    var type = typeof env.parent[key];
    if( type === 'string' || type === 'number' || type === 'boolean' ) {
      console.log(`${key}: ${env.parent[key]}`);
      env[key] = env.parent[key];
    }
  }
}

// function mergeSubCommandOptions(arg) {
//   if( typeof arg === 'string' ) {
//     return;
//   }
  
//   for( var key in arg ) {
//     if( key.match(/^_/) ) continue;
//     if( typeof arg[key] !== 'string' ) continue;
//     config[key] = arg[key];
//   }
// }