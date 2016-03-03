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
      var id = parts.join('/');
      parts.splice(parts.length-1, 1);

      newFeature.properties.parents = parts;
      newFeature.properties.subregions = [];
      newFeature.properties.nodes = {};
      newFeature.properties.repo = {
        path : parts.join('/'),
        filename : filename
      };

      newFeature.properties.id = id;
      lookup[id] = newFeature;


      geojson.features[i] = newFeature;
    }
  }

  geojson.features.forEach(function(region){
    if( !region.properties.parents ) {
      return;
    }
    if( region.properties.parents.length === 0 ) {
      return;
    }

    var parent = region.properties.parents[region.properties.parents.length-1];
    //console.log('- '+region.properties.id);
    //console.log(parent);

    if( lookup[parent] ) {
      lookup[parent].properties.subregions.push(region.properties.id);
    }
  });

  return lookup;
}

module.exports = crawl;
