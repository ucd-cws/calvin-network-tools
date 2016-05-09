'use strict';

var config = require('../config').get();
var crawler = require('../hnf')();

module.exports = function(callback) {
  if( config.verbose ) {
    console.log('Running **Crawl** command.\n');
  }

  var path = config.data;

  if( !path ) {
    console.log('No data path provided');
    process.exit(-1);
  }

  crawler.crawl(path, function(result){
    console.log('*********');
    console.log('Regions: '+result.regions.features.length);
    console.log('Nodes/Links: '+result.nodes.features.length);
    console.log('done.');
    callback();
  });
};
