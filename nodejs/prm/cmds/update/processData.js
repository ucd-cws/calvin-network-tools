'use strict';

var diff = require('deep-diff').diff;
var crawler = require('../../../crawler');
var ExportReader = require('./jsonExportReader');

module.exports = function(dir, args, callback) {
  var reader = new ExportReader(dir);

  var path;
  if( args.d ) {
    path = args.d;
  } else if( args.data ) {
    path = args.data;
  }

  if( !path ) {
    console.log('No data path provided');
    process.exit(-1);
  }

  console.log('Crawling data directory');
  crawler(path, function(result){
    for( var i = 0; i < result.nodes.length; i++ ) {
      if( reader.hasParam(result.nodes[i].properties.prmname, 'FLOW_LOC(KAF)') ) {
        console.log(result.nodes[i].properties.prmname+': ');

        var newData = reader.getDataArray(result.nodes[i].properties.prmname, 'FLOW_LOC(KAF)');
        var oldData = result.nodes[i].properties.flow;

        // round dss data
        for( var j = 1; j < newData.length; j++ ) {
          newData[j][1] = Math.round(newData[j][1] * 1000) / 1000;
        }

        if( newData && !oldData ) {
          console.log('  -- New');
          continue;
        }

        var h1 = toHash(oldData);
        var h2 = toHash(newData);

        var differences = diff(h1, h2);
        if( !differences ) {
          console.log('  -- No Changes');
        } else {
          console.log('  -- Changes: '+differences.length);
        }

      }
    }
    callback();
  });
};

function toHash(data) {
  var hash = {};
  for( var i = 1; i < data.length; i++ ) {
    hash[data[i][0]] = data[i][1];
  }

  return hash;
}
