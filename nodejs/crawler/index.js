'use strict';

var fs = require('fs');
var path = require('path');
var walk = require('walk');
var readGeoJson = require('./readGeoJson');
var regionsImporter = require('./regions');
var networkImporter = require('./network');
var git = require('../git');

var regions = {};
var regionCollection = {
  type : 'FeatureCollection',
  features : []
};
var networkCollection = {
  type : 'FeatureCollection',
  features : []
};

var config = {
  id : 'prmname',
  region : 'region.geojson',
  node : 'node.geojson',
  link : 'link.geojson'
};

function walkDir(dir, options, callback) {

  // read in custom config
  if( fs.existsSync(path.join(dir, 'conf.json')) ) {
    var tmp = require(path.join(dir, 'conf.json'));
    for( var key in tmp ) {
      config[key] = tmp[key];
    }
  }
  options.walkerConfig = config;

  var walker = walk.walk(dir, {});
  var pathSepRegex = new RegExp('^'+path.sep);

  walker.on('file', function (root, fileStats, next) {
    var isRegion = false;
    var type = '';
    var name = fileStats.name;

    if( name === config.region ) {
      isRegion = true;
    } else if( name === config.link ) {
      type = 'link';
    } else if ( name === config.node ) {
      type = 'node';
    } else {
      return next();
    }

    var filepath = path.join(root.replace(dir, ''), fileStats.name);
    if( filepath.match(pathSepRegex) ) {
      filepath = filepath.replace(pathSepRegex, '');
    }

    var ref = {
      $ref : filepath
    };

    if( isRegion ) {
      regionCollection.features.push(ref);
    } else {
      ref.type = type;
      networkCollection.features.push(ref);
    }

    next();
  });

  walker.on('errors', function (root, nodeStatsArray, next) {
    next();
  });

  walker.on('end', function () {
    crawler(dir, options, callback);
  });
}

function crawler(dir, options, callback) {
  //var regionCollection = readGeoJson(path.join(dir, 'regions.geojson'));
  //var networkCollection = readGeoJson(path.join(dir, 'network.geojson'));

  var regionLookup = regionsImporter(dir, regionCollection);
  networkImporter(dir, regionLookup, networkCollection, options, function(){
    git.info(dir, function(gitInfo) {

      var key;
      regionCollection.features.forEach(function(f){
        for( key in gitInfo ){
          f.properties.hobbes.repo[key] = gitInfo[key];
        }
      });
      networkCollection.features.forEach(function(f){
        for( key in gitInfo ){
          f.properties.hobbes.repo[key] = gitInfo[key];
        }
      });

      callback({
        nodes : networkCollection,
        regions : regionCollection
      });

    });
  });
}

module.exports = walkDir;
