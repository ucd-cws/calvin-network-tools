'use strict';

var path = require('path');
var extend = require('extend');
var async = require('async');
var readGeoJson = require('./readGeoJson');
var readRefs = require('./readRefs');

function crawl(root, regionLookup, geojson, parseCsvData, callback) {
  var region, node;
  var lookup = {};

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

      lookup[newNode.properties.prmname] = newNode;
      geojson.features[i] = newNode;
    }
  }

  geojson.features.forEach(function(node){
    setOriginsTerminals(node, geojson.features);
  });

  processLinks(geojson.features, lookup);

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

function setOriginsTerminals(node, nodes) {
  if( node.properties.type === 'Diversion' || node.properties.type === 'Return Flow' ) {
    return;
  }

  var origins = [];
  var terminals = [];
  for( var i = 0; i < nodes.length; i++ ) {
    if( nodes[i].properties.terminus === node.properties.prmname ) {
      origins.push({
        prmname : nodes[i].properties.origin,
        link_prmname : nodes[i].properties.prmname
      });
    } else if ( nodes[i].properties.origin === node.properties.prmname ) {
      terminals.push({
        prmname : nodes[i].properties.terminus,
        link_prmname : nodes[i].properties.prmname
      });
    }
  }

  node.properties.origins = origins;
  node.properties.terminals = terminals;
}

function processLinks(nodes, lookup) {
  var removeList = [];

  nodes.forEach(function(node){
    if( node.geometry !== null ) {
      return;
    }

    if( node.properties.origin && node.properties.terminus ) {
      var origin = lookup[node.properties.origin];
      var terminus = lookup[node.properties.terminus];

      if( !origin || !terminus ) {
        if( global.debug ) {
          console.log('Found link but nodes are missing geo: '+node.properties.prmname);
        }
        return;
      } else if( !origin.geometry || !terminus.geometry ) {
        if( global.debug ) {
          console.log('Found link but nodes are missing geo: '+node.properties.prmname);
        }
        return;
      }

      node.geometry = {
        type : 'LineString',
        coordinates: [
          origin.geometry.coordinates,
          terminus.geometry.coordinates
        ]
      };

    } else {
      if( global.debug ) {
        console.log('Found node with missing geo but not link: '+node.properties.prmname);
      }
      removeList.push(node);
    }
  });

  removeList.forEach(function(node){
    nodes.splice(nodes.indexOf(node), 1);
  });
}

module.exports = crawl;
