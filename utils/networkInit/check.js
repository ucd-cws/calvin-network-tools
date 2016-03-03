'use strict';
global.debug = true;
var crawler = require('../../nodejs/crawlerV2');
var data = '/Users/jrmerz/dev/watershed/calvin-network-data/data';

var t = new Date().getTime();
crawler(data, {parseCsv: false}, function(resp){

  resp.nodes.features.forEach(function(node){
    if( node.properties.type === 'Diversion' ) {
      //console.log(node.geometry);
    } else {
      console.log(node.properties.origins);
      console.log(node.properties.terminals);
      console.log();
    }

  });
  console.log(new Date().getTime()-t);
});
