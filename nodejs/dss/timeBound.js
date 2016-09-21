'use strict';

var fs = require('fs');
var path = require('./path');

module.exports = function(type, prmname, boundType, file) {

  return {
    csvFilePath : file.$ref,
    type : 'timeseries',
    parameter : '1MON',
    units : 'KAF',
    location : prmname,
    xtype : 'UNT',
    path : path.timeBound(type, prmname, boundType, 'dss')
  };
};
