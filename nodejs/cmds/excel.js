'use strict';

var config = require('../config').get();
var excel = require('../excel');
var checkRequired = require('../lib/checkRequired');
var required = ['excel-path', 'data'];

module.exports = function(callback) {
  if( config.verbose ) {
    console.log('Running **Excel** command.\n');
  }

  checkRequired(required);
  excel(callback);
};
