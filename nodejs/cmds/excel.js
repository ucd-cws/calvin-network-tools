'use strict';

var excel = require('../excel');
var checkRequired = require('../lib/checkRequired');
var required = ['excel-path', 'data'];

module.exports = function(callback) {
  console.log('Running **Excel** command.\n');
  checkRequired(required);
  excel(callback);
};
