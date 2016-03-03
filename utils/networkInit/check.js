'use strict';
global.debug = true;
var crawler = require('../../nodejs/crawlerV2');
var data = '/Users/jrmerz/dev/watershed/calvin-network-data/data';

var t = new Date().getTime();
crawler(data, {parseCsv: false}, function(resp){

  resp.regions.features.forEach(function(node){
    console.log(node.properties.id);
    console.log(node.properties.subregions);
    console.log();
  });
  console.log(new Date().getTime()-t);
});
