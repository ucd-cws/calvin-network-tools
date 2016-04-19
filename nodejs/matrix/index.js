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

//var hnf = require('hobbes-network-format');
var hnf = require('../../../hobbes-network-format');
var async = require('async');
var link = require('./link');
var node = require('./node');

function matrix(config, callback) {
    console.log('Reading network...');

    if( config.start ) {
      config.start = new Date(config.start).getTime();
    }
    if( config.end ) {
      config.end = new Date(config.end).getTime();
    }

    hnf.split(config.path, {}, config.nodes, function(network) {
      var rows_for = {};
      var inflow_source = {};

      async.eachSeries(
        network.in,
        function(item, next) {
          var p=item.properties;
          var id=p.hobbes.networkId;
          if( p.hobbes.type === 'node' ) {
            node(item,hnf,config,function(res) {
              var i;
              for (i in res.inflows) {
                inflow_source[i]=true;
              }
              rows_for[id]=res.rows;
              next();
            }); // end node
          } else {  // Link
            link(item, hnf, config, function(linkRows){
              var id=item.properties.hobbes.networkId;
              rows_for[id] = linkRows;
              next();
            }); // end link
          }
        },
        function() {
          var i;
          var rows = [];
          // console.log(config.start);
          // Add Inflows
          Object.keys(inflow_source).forEach(function(key) {
            rows.push(['SOURCE',key,0,1,0,null]);
          });

          for( i in rows_for ) {
            rows_for[i].forEach(function(r) {
              rows.push(r);
            });
          }

          callback(rows);
        }); // end async
      }); // end split
    }

    module.exports = matrix;
