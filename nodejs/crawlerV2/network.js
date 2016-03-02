'use strict';

var path = require('path');
var extend = require('extend');
var async = require('async');
var readGeoJson = require('./readGeoJson');
var readRefs = require('./readRefs');

function crawl(root, regionLookup, geojson, parseCsvData, callback) {
  var region, node;

  for( var i = 0; i < geojson.features.length; i++ ) {
    node = geojson.features[i];

    if( node.$ref ) {
      var newNode = readGeoJson(path.join(root, node.$ref));
      var parts = node.$ref.split('/');
      var filename = parts.splice(parts.length-1, 1)[0];

      newNode.properties.regions = parts;
      newNode.properties.repo = {
        path : parts.join('/'),
        filename : filename
      };

      for( var j = parts.length-1; j >= 0; j-- ) {
        region = regionLookup[parts[j]];
        if( region ) {
          region.properties.nodes[newNode.properties.prmname] = newNode.properties.type;
          newNode.properties.regions = extend(false, [], region.properties.parents);
          break;
        }
      }

      geojson.features[i] = newNode;
    }
  }

  if( !parseCsvData ) {
    return callback();
  }

  async.eachSeries(
    geojson.features,
    function(feature, next) {
      readRefs(path.join(root, feature.properties.repo.path), feature.properties.prmname, feature, 'properties', parseCsvData, next);
    },
    callback
  );
}

module.exports = crawl;
