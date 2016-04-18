'use strict';

var async = require('async');
var clone = require('./clone');
// expand out all links from the hnf.split response

module.exports = function(network, matrixObjects, hnf, callback) {
  async.eachSeries(
    network.in,
    function(node, next) {


      if( node.properties.hobbes.type === 'link' ) {

        // TODO: what if there is no flow?
        if( !node.properties.flow ) {
          var n = clone(node);
          n.properties.id = [node.properties.prmname, '--'];
          n.properties.flow = [0];

          return next();
        }

        hnf.expand(node, ['flow'], function(){
          for( var i = 1; i < node.properties.flow.length; i++ ) {
            var n = clone(node);

            n.properties.id = [node.properties.prmname, node.properties.flow[i][0]];
            n.properties.flow = [node.properties.flow[i][1]];
            matrixObjects.push(n);
          }

          next();
        });
      } else {

        // TODO: what if there is no flow?
        if( !node.properties.inflows ) {
          return next();
        }

        hnf.expand(node, ['inflows.default.inflow'], function(){
          var inflow = node.properties.inflows.default.inflow;

          for( var i = 1; i < inflow.length; i++ ) {
            var n = clone(node);

            n.properties.id = [node.properties.prmname, inflow[i][0]];
            n.properties.inflow = [inflow[i][1]];
            matrixObjects.push(n);
          }

          next();
        });

      }


    },
    function(err) {
      callback(matrixObjects);
    }
  );
};
