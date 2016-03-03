'use strict';
global.debug = true;
var crawler = require('../../nodejs/crawlerV2');
var data = '/Users/jrmerz/dev/watershed/calvin-network-data/data';

var t = new Date().getTime();
crawler(data, {parseCsv: false}, function(resp){

  resp.nodes.features.forEach(function(node){
  //  console.log(node.properties);
  //  console.log();
  });
  console.log(new Date().getTime()-t);
});
