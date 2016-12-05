'use strict';

var extend = require('extend');

module.exports = function(node) {
  return {
    geometry : node.geometry,
    properties : {
      id : extend(true, [], node.properties.id || []),
      prmname : node.properties.prmname,
      hobbes : node.properties.hobbes,
      flows : node.properties.flows,
      origin : node.properties.origin || node.properties.prmname,
      terminus : node.properties.terminus || node.properties.prmname,
      costs : node.properties.costs,
      bounds : node.properties.bounds
    }
  };
};
