'use strict';

var fs = require('fs');
var path = require('path');
var diff = require('deep-diff').diff;
var crawler = require('hobbes-network-format');

var config = require('../../config').get();
var ExportReader = require('./jsonExportReader');

module.exports = function(dir, callback) {
  var reader = new ExportReader(dir);

  var path = config.data;

  if( !path ) {
    console.log('No data path provided');
    process.exit(-1);
  }

  console.log('Crawling data directory');
  crawler(path, {parseCsvData: true}, function(result){
    var nodes = result.nodes.features;

    for( var i = 0; i < nodes.length; i++ ) {
      if( reader.hasParam(nodes[i].properties.prmname, 'FLOW_LOC(KAF)') ) {
        console.log(nodes[i].properties.prmname+': ');

        var newData = reader.getDataArray(nodes[i].properties.prmname, 'FLOW_LOC(KAF)');
        var oldData = nodes[i].properties.flow;

        // round dss data
        for( var j = 1; j < newData.length; j++ ) {
          newData[j][1] = Math.round(newData[j][1] * 1000) / 1000;
        }

        if( newData && !oldData ) {
          console.log('  -- New');
          updateCsvData(path, nodes[i], newData);
          continue;
        }

        // TODO, make this a simple string compare
        var h1 = toHash(oldData);
        var h2 = toHash(newData);

        var differences = diff(h1, h2);
        if( !differences ) {
          console.log('  -- No Changes');
        } else {
          console.log('  -- Changes: '+differences.length);
          updateCsvData(path, nodes[i], newData);
        }

      }
    }
    callback();
  });
};

function updateCsvData(root, node, newData) {
  var filepath = path.join(root, node.properties.hobbes.repo.path, node.properties.hobbes.repo.filename);
  var csvpath = path.join(root, node.properties.hobbes.repo.path, 'flow.csv');
  var file = fs.readFileSync(filepath, 'utf-8');

  file = JSON.parse(file.replace(/\n|\r/g, ''));
  file.properties.flow = {
    $ref : 'flow.csv'
  };

  fs.writeFileSync(filepath, JSON.stringify(file, '  ', '  '));

  if( fs.existsSync(csvpath) ) {
    fs.unlinkSync(csvpath);
  }

  newData.unshift(['date','kaf']);
  var csvdata = newData.map(function(row){
    return row.join(',');
  }).join('\n');

  fs.writeFileSync(csvpath, csvdata);
}

function toHash(data) {
  var hash = {};
  for( var i = 1; i < data.length; i++ ) {
    hash[data[i][0]] = data[i][1];
  }

  return hash;
}
