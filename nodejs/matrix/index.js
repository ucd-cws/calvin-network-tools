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
          var p = item.properties;
          var id = p.hobbes.networkId;
          var inf_at; // INFLOW names
          var row;

          if( p.hobbes.type === 'node' ) {
            //=node(item,hnf,inflow_source);
            if( p.inflows ) {
              rows_for[id] = [];

              hnf.expand(item, ['inflows.default.inflow'], function() {
                var inflow = item.properties.inflows.default.inflow;
                var time;

                for( var i = 1; i < inflow.length; i++ ) {
                  time = new Date(inflow[i][0]);

                  if( ( !config.start || config.start < time ) && (!config.end || time < config.end) ) {
                    inf_at = ['INFLOW', inflow[i][0]].join('@');
                    inflow_source[inf_at] = true;

                    row = [
                      inf_at,
                      [id, inflow[i][0]].join('@'),
                      0,
                      1,
                      inflow[i][1],
                      inflow[i][1]
                    ].join(',');

                    rows_for[id].push(row);
                  }
                }

                next();
             });
           } else { // no inflow, ignore
             next();
           }
         } else {  // Link
           console.log('Link');
           link(item, hnf, config, function(linkRows){
             rows_for[id] = linkRows;
             console.log(linkRows);
             console.log('Linked');
             next();
           });
         }
        },
        function() {
          var i;
          var rows = [];
          console.log(config.start);

          // Add Inflows
          Object.keys(inflow_source).forEach(function(key) {
            rows.unshift(['SOURCE',key,0,1,null,null].join(','));
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
