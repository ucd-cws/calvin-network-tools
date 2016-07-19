'use strict';

var config = require('../config').get();
var excel = require('../excel');
var checkRequired = require('../lib/checkRequired');
var required = ['excelPath', 'data'];

module.exports = function(callback) {
  if( config.verbose ) {
    console.log('Running **Excel** command.\n');
  }

  checkRequired(required);
  excel(config, callback);
};
