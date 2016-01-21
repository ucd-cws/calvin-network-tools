'use strict';

var crawler = require('../../crawler');
var excel = require('../../excel');

module.exports = function(argv, callback) {
  console.log('Running **Excel** command.\n');

  if( !argv.data ) {
    console.log('No path provided');
    return callback();
  }

  if( !argv.x ) {
    console.log('No excel provided');
    return callback();
  }

  excel(argv, callback);
};
