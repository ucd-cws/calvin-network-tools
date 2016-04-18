'use strict';

var async = require('async');
var clone = require('./clone');

module.exports = function(network, matrixObjects, hnf, callback) {
  var node, costs;
  var newNodes = [];

  async.eachSeries(
    matrixObjects,
    function(node, next) {
      // no cost data
      if( !node.properties.costs ) {
        node.properties.id.push('c0');
        node.properties.cost = 0;
        newNodes.push(node);
        return next();
      }

      // no date associated with materix entry
      if( node.properties.id[1] === '--' ) {
        node.properties.id.push('c0');
        node.properties.cost = 0;
        newNodes.push(node);
        return next();
      }

      costs = node.properties.costs;
      if( costs.type === 'Constant' ) {
        node.properties.id.push('c0');
        node.properties.cost = costs.costs;
        newNodes.push(node);
        return next();
      }

      // remove current object
      var month = getMonth(node.properties.id[1]);
      costs = costs.costs[month];
      var tmp;

      if( costs.$ref ) { // we have not read the cost csv in yet
        hnf.expand(node, ['costs.costs.'+month], function(){
          costs = node.properties.costs.costs[month];
          addCosts(newNodes, costs, node);
          next();
        });
      } else {
        addCosts(newNodes, costs, node);
        next();
      }
    },
    function(err) {
      callback(newNodes);
    }
  );
};

function addCosts(arr, costs, node) {
  var tmp;
  for( var i = 2; i < costs.length; i++ ) {
    tmp = clone(node);
    tmp.properties.costSlope = (costs[i][0] - costs[i-1][0]) / (costs[i][1] - costs[i-1][1]);
    tmp.properties.id.push('c'+(i-2));
    arr.push(tmp);
  }
}

var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
function getMonth(dateString) {
  var m = parseInt(dateString.split('-')[1])-1;
  return months[m];
}
