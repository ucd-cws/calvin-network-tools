'use strict';
global.debug = true;
var crawler = require('../../nodejs/crawlerV2');
var data = '/Users/jrmerz/dev/watershed/calvin-network-data/data';

var t = new Date().getTime();
crawler(data, {parseCsv: true}, function(resp){
  console.log(new Date().getTime()-t);
});
