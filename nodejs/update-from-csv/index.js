'use strict';

var xlsx = require('xlsx');
var async = require('async');
var fs = require('fs');
var parse = require('csv-parse');
var stringify = require('csv-stringify');
var transform = require('stream-transform');
var path = require('path');
var hnf = require('../hnf')();
var crawler = hnf.crawl;

var callback;
var lookup = {};
var data = {};

module.exports = function(args, cb) {
  var callback = cb;

  if( !fs.existsSync(args.file) ) {
    console.log('Invalid file: '+args.excelPath);
    if( callback ) callback();
    return;
  }

  if( args.property !== 'flow' && args.property  !== 'storage' ) {
    return console.error('Only flow and storage properties supported at the moment');
  }

  var options = {
    onlyParse : function(file) {
      return false;
    }
  }

  crawler(args.data, options, function(results){
    results.nodes.features.forEach((feature) => {
      lookup[feature.properties.prmname.toLowerCase()] = feature;
      data[feature.properties.prmname.toLowerCase()] = [['date', 'kaf']];
    });

    process(args);
  });
};

function process(args) {
  var parser = parse({delimiter: ','})
  var input = fs.createReadStream(args.file);
  var header = null;

  var unknownPrmnames = {};

  var transformer = transform(function(record, callback){
    if( !header ) {
      header = record;
      return callback();
    }

    var date = record[0];
    for( var i = 1; i < record.length; i++ ) {
      if( !data[header[i].toLowerCase()] ) {
        unknownPrmnames[header[i].toLowerCase()] = true;
        continue;
      }

      data[header[i].toLowerCase()].push([date, record[i]]);
    }

    callback();
  });

  input.on('end', function(){
    writeResults(args);
    console.warn(`Unknown parameter names: ${Object.keys(unknownPrmnames)}`);
  });


  input.pipe(parser).pipe(transformer);
}

function writeResults(args) {
  var prop, file, feature, updateJson;


  for( var key in data ) {
    if( data[key].length === 1 ) continue;

    feature = lookup[key];
    prop = feature.properties[args.property];
    updateJson = false;

    // files w/o a flow
    if( !prop ) {
      file = path.join(args.data, feature.properties.hobbes.repo.path, args.property+'.csv');
      updateJson = true;
      feature.properties[args.property] = {
        '$ref' : file
      }

      var jsonfile = path.join(args.data, feature.properties.hobbes.repo.path, feature.properties.hobbes.repo.filename);
      fs.writeFileSync(jsonfile, JSON.stringify(feature,'  ', '  '));
    } else {
      file = prop.$ref;
    }


    writeFile(file, data[key]);
  }
}

function writeFile(file, data) {
  stringify(data, function(err, csv){
    fs.writeFileSync(file, csv);
  });
}