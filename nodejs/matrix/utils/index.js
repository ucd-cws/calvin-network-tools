/* General Utilities
*/

var nodeLookup = {};

module.exports = {
  id : function(id, step) {
    var config = require('../mconfig')();
    return [id, step].join(config["ts"] || '@');
  },
  initNodeLookup : function(nodes) {
    nodes.forEach((n) => nodeLookup[n.properties.hobbes.id] = n);
  },
  getNodeById : function(id) {
    return nodeLookup[id];
  },
  roundCostAmp : function(val) {
    if( typeof val !== 'number' ) {
      return val;
    }
    return val.toFixed(5)
  },
  roundBound : function(val) {
    if( typeof val !== 'number' ) {
      return val;
    }
    return val.toFixed(3)
  }
};
