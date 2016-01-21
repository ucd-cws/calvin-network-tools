'use strict';

var crawler = require('../../crawler');

module.exports = function(argv, callback) {
  console.log('Running **Crawl** command.\n');

  var path = '';
  if( argv.d ) {
    path = argv.d;
  } else if( argv.data ) {
    path = argv.data;
  }

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
