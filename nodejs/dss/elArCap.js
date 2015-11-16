'use strict';

var fs = require('fs');
var path = require('./path');

module.exports = function(prmname, file) {
  return {
    csvFilePath : file,
    type : 'paired',
    label : 'EL',
    location : prmname,
    xunits : 'FT',
    xtype : 'UNT',
    yunits : 'KA',
    ytype : '',
    path : path.eac(prmname, 'dss')
  };
};
