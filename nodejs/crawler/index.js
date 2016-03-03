'use strict';

var fs = require('fs');
var path = require('path');
var readGeoJson = require('./readGeoJson');
var regionsImporter = require('./regions');
var networkImporter = require('./network');
var git = require('../git');
var regions = {};


function crawler(dir, options, callback) {
  var regionCollection = readGeoJson(path.join(dir, 'regions.geojson'));
  var networkCollection = readGeoJson(path.join(dir, 'network.geojson'));

  var regionLookup = regionsImporter(dir, regionCollection);
  networkImporter(dir, regionLookup, networkCollection, options.parseCsv, function(){
    git.info(dir, function(gitInfo) {

      var key;
      regionCollection.features.forEach(function(f){
        for( key in gitInfo ){
          f.properties.repo[key] = gitInfo[key];
        }
      });
      networkCollection.features.forEach(function(f){
        for( key in gitInfo ){
          f.properties.repo[key] = gitInfo[key];
        }
      });

      callback({
        nodes : networkCollection,
        regions : regionCollection
      });

    });
  });
}

module.exports = crawler;
