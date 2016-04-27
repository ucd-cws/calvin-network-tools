'use strict';

// The following Nodes are included in the formulation
// Any node with an inflow is added
// Any storage node flows from timestep to timestep
// Storage Nodes have Initial and Finals

var netu = require('./split_utils');
var storage = require('./storage');
var inflows = require('./inflows');
var sink=require('./sink');
var u = require('./utils');

module.exports = function(item, subnet) {
  var config = require('./mconfig')();
  var p = item.properties;
  var id = p.hobbes.networkId;
  var rows=[];

  // Look through flow, get boundaries
  // Need to get the boundaries from here.  But they
  // aren't expanded like the links where.  I guess you async.ForEach this?

  var time, step, steps = [];
  var e,edge;
  var inbound=netu.inbound_to(subnet,id);
  var outbound=netu.outbound_from(subnet,id);
  var flow = item.properties.flow;
  if (! flow ) {
    if (item.properties.storage) {
      flow=item.properties.storage;
    } else {
       flow=[];
    }
  }

  for (var i = 1; i < flow.length; i++) { // i=0 is header;
    step = flow[i][0];
    time = new Date(step).getTime();
    // Get boundary Conditions
    if ((!config.start || config.start < time) &&
      (!config.end || time < config.end)) {
      steps.push(flow[i][0]);

      // Add Inflows from edge links
      debugger;
      for (e = 0; e < inbound.length; e++) {
        edge = inbound[e].properties;
        rows.push([
          u.id('INBOUND', step),
          u.id(id, step),
          e, 0, 1, edge.flow[i][1], edge.flow[i][1]]);
      }
      for (e = 0; e < outbound.length; e++) {
        edge = outbound[e].properties;
        rows.push([
          u.id(id, step),
          u.id('OUTBOUND', step),
          e, 0, 1, edge.flow[i][1], edge.flow[i][1]]);
      }
    }
  }

  sink(item, steps).forEach(function (r) {
    rows.push(r);
  });

  if (p.storage) {
    storage(item, steps).forEach(function (r) {
      rows.push(r);
    });
  }

  inflows(item, steps).forEach(function (r) {
    rows.push(r);
  });

  return rows;
}
