'use strict';

var fs = require('fs');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var crawler = require('../crawler');
var tv4=require('tv4');

var schemas=['common','prmname'];

schemas.forEach(function(schema,index,array) {
  var base='/home/quinn/calvin-network-data';
  var root='http://cws.casil.ucdavis.edu/calvindb/';
  var fn=base+'/'+'json-schema/'+schema+'.json';
  var json = JSON.parse(fs.readFileSync(fn).toString());
  tv4.addSchema(root+schema+'.json',json);
});

var common=tv4.getSchema('http://cws.casil.ucdavis.edu/calvindb/common.json');
//console.log(common);

argv._.forEach(
  function(fn,index,array) {
    var node=JSON.parse(fs.readFileSync(fn).toString());
    var np=node.properties;
    delete np.inflows;  // Don't have this right.
    var valid=tv4.validateResult(np,common);
    console.log(np);
    console.log(valid);
  }
);
