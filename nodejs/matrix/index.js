// matrix prints out the required matrix inputs for any given set of nodes
// or links
// The matrix is i,j,k,c,a,l,u
// where i = origin
// j= terminal
// k = link number
// c = cost
// a = itamplitude
// l = lower bound
// u = upper bound


'use strict';

var hnf = require('../hnf')();
var expand = require('./expand');
var async = require('async');
var link = require('./link');
var node = require('./node');

function matrix(config, callback) {
    require('./mconfig')(config); // set the config
//    console.log('Reading network...');

    if( config.start ) {
      config.start = new Date(config.start).getTime();
    }
    if( config.end ) {
      config.end = new Date(config.end).getTime();
    }

    hnf.split(config.path, {}, config.nodes, function(subnet) {
      expand(subnet, function(){
        onSubnetReady(subnet, config, callback);
      });
    }); // end split
}

function onSubnetReady(subnet, config, callback) {
  var rows_for = {};
  var inflow_source = {};
  var inbound={};
  var outbound={};
  
  subnet.in.forEach(function(item){
    var p = item.properties;
    var id = p.hobbes.networkId;
    
    if( p.hobbes.type === 'node' ) {
      rows_for[id] = node(item, subnet);
    } else {  
      rows_for[id] = link(item, subnet); 
    }
  });

    
  var i;
  var rows = [];

  for( i in rows_for ) {    
    rows_for[i].forEach(function(r) {
      if (r[0].indexOf("INFLOW@")===0 && ! inbound[r[0]]) {
        rows.push(['SOURCE',r[0],0,1,0,null]);
        inbound[r[0]]++
      }
      if (r[0].indexOf("INBOUND@")===0 && ! inbound[r[0]]) {
        rows.push(['SOURCE',r[0],0,1,0,null]);
        inbound[r[0]]++
      }
      if (r[1].indexOf("OUTBOUND@")===0 && ! outbound[r[1]]) {
        rows.push([r[1],'SINK',0,1,0,null]);
        outbound[r[1]]++
      }
      rows.push(r);
    });
  }
  callback(rows);
}



module.exports = matrix;
