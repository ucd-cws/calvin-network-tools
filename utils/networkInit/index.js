'use strict';

var fs = require('fs');
var crawler = require('../../nodejs/crawler');
var data = '/Users/jrmerz/dev/watershed/calvin-network-data/data';

var network = {
  type : 'FeatureCollection',
  features : []
};
var regions = {
  type : 'FeatureCollection',
  features : []
};


crawler(data, {parseCsv : false}, function(results){

  results.nodes.forEach(function(node){
    network.features.push({
      $ref : node.properties.repo.dir.replace(data+'/','')+'/'+node.properties.repo.filename
    });
  });

  results.regions.forEach(function(node){
    if( !node.path ) return;

    regions.features.push({
      $ref : node.path.replace(data+'/', '')+'/region.geojson'
    });
  });


  if( fs.existsSync(data+'/network.geojson') ) {
    fs.unlinkSync(data+'/network.geojson');
  }
  if( fs.existsSync(data+'/regions.geojson') ) {
    fs.unlinkSync(data+'/regions.geojson');
  }

  fs.writeFileSync(data+'/network.geojson', JSON.stringify(network, '  ','  '));
  fs.writeFileSync(data+'/regions.geojson', JSON.stringify(regions, '  ','  '));

});
