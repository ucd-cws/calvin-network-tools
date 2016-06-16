'use strict';

var fs = require('fs');
var path = require('./path');

module.exports = function(prmname, a, file) {

  return {
    csvFilePath : file.$ref,
    type : 'timeseries',
    parameter : 'FLOW_DIV(KAF)',
    location : prmname,
    units : 'KAF',
    xtype : 'PER-AVER',
    path : path.flow(prmname, a, 'dss')
  };
};
