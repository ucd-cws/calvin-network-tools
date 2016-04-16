// matrix prints out the required matrix inputs for any given set of nodes
// or links
// The matrix is i,j,k,c,a,l,u
// where i = origin
// j= terminal
// k = link number
// c = cost
// a =amplitude
// l = lower bound
// u = upper bound


'use strict';

var matrix = require('../matrix');

module.exports = function(cb) {
  if( config.verbose ) {
    console.log('Running **'+config.nodeCmdType+'** command.\n');
  }

  callback = cb;

  if( !config.nodes && !config.debug ) {
    console.log('Please provide a nodes to '+config.nodeCmdType);
    return callback();
  }

  if( !config.data ) {
    console.log('Please provide a data repo location');
    return callback();
  }
  // TODO:  Add output file parameter

    matrix(config);
    // TODO: Should I catch errors here? 
};

