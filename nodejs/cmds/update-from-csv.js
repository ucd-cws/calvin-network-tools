'use strict';

var config = require('../config').get();
var updateFromCsv = require('../update-from-csv');

module.exports = function(callback) {
  if( config.verbose ) {
    console.log('Running **CSV UPDATE** command.\n');
  }

  updateFromCsv(config, callback);
};
