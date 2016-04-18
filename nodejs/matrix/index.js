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
var workflow = ['links','costs','bounds'];


function matrix(config, callback) {

    console.log('Reading network...');
    hnf.split(config.path, {}, config.nodes, function(network) {
      var matrixObjects = [];

      async.eachSeries(
        workflow,
        function(action, next) {
          console.log('Running Action: '+action);
          require('./'+action)(network, matrixObjects, hnf, function(resp){
            matrixObjects = resp;
            next();
          });
        },
        function() {
          var props;
          for( var i = 0; i < matrixObjects.length; i++ ) {
            props = matrixObjects[i].properties;
            matrixObjects[i] = [
              props.origin,
              props.terminus,
              props.id.join(':'),
              props.costSlope,
              props.amplitude || 0,
              props.lowerBound,
              props.upperBound
            ];
          }

          callback(matrixObjects);
        }
      );
    });

    // Need to consider what updateStorge does with times
    // for( var i = 0; i < list.length; i++ ) {
    //   var net = list[i].properties;
    //
    //   if( (config.matrixB || true) && net.inflows) {
    //     for (var key in net.inflows) {
    //       var fn = net.inflows[key].inflow;
    //       if( fn.match(/.*\.csv$/) ) {
    //         parse_csv(fn,function(err,data) {
    //           data.forEach(function(d) {
    //             console.log([[net.prmname,d[0]].join('@'),d[1]].join(','));
    //           });
    //         });
    //       }
    //     }
    //   }
    // }
}

module.exports = matrix;
