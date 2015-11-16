'use strict';

var fs = require('fs');
var dsspath = require('./path');
var path = require('path');

module.exports = function(prmname) {
  return {
    csvFilePath : path.join(__dirname, 'dummy.csv'),
    type : 'paired',
    label : 'BLANK',
    date : 'ALL',
    location : 'DUMMY',
    xunits : 'KAF',
    xtype : 'DIVR',
    yunits : 'Penalty',
    ytype : '',
    path : dsspath.empty('dss')
  };
};
