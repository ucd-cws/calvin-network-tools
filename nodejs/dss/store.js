'use strict';

var path = require('./path');

module.exports = function(prmname, a, file) {

  return {
    csvFilePath : file.$ref,
    type : 'timeseries',
    parameter : 'STOR',
    location : prmname,
    units : 'KAF',
    xtype : 'PER-AVER',
    path : path.store(prmname, a, 'dss')
  };
};
