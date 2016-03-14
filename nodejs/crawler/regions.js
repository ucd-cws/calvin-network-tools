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

      newFeature.properties.hobbes = {
        parents : parts,
        subregions : [],
        nodes : {},
        repo : {
          path : parts.join('/'),
          filename : filename
        },
        id : id
      };

      lookup[id] = newFeature;
      geojson.features[i] = newFeature;
    }
  }

  geojson.features.forEach(function(region){
    if( !region.properties.hobbes.parents ) {
      return;
    }
    if( region.properties.hobbes.parents.length === 0 ) {
      return;
    }

    var parent = region.properties.hobbes.parents[region.properties.hobbes.parents.length-1];
    if( lookup[parent] ) {
      lookup[parent].properties.hobbes.subregions.push(region.properties.hobbes.id);
    }
  });

  return lookup;
}

module.exports = crawl;
