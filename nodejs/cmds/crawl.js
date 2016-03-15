'use strict';

var config = require('../config').get();
var crawler = require('hobbes-network-format');

module.exports = function(callback) {
  console.log('Running **Crawl** command.\n');

  var path = config.data;

  if( !path ) {
    console.log('No data path provided');
    process.exit(-1);
  }

  crawler(path, function(result){
    console.log('*********');
    console.log('Regions: '+result.regions.length);
    console.log('Nodes/Links: '+result.nodes.length);
    console.log('done.');
    callback();
  });
};
