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
  }
};
