'use strict';
var path = require('path');
var readGeoJson = require('./readGeoJson');

function crawl(root, geojson, callback) {
  var lookup = {}, region;

  for( var i = 0; i < geojson.features.length; i++ ) {
    region = geojson.features[i];

    if( region.$ref ) {
      var newFeature = readGeoJson(path.join(root, region.$ref));
      var parts = region.$ref.split('/');
      var filename = parts.splice(parts.length-1, 1)[0];


      newFeature.properties.parents = parts;
      newFeature.properties.nodes = {};
      newFeature.properties.repo = {
        path : parts.join('/'),
        filename : filename
      };

      if( parts.length > 0 ) {
        var id = parts[parts.length-1];
        newFeature.properties.id = id;
        lookup[id] = newFeature;
      }

      geojson.features[i] = newFeature;
    }
  }

  return lookup;
}

module.exports = crawl;
