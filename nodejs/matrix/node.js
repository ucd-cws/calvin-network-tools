'use strict';

// The following Nodes are included in the formulation
// Any node with an inflow is added
// Any storage node flows from timestep to timestep
// Storage Nodes have Initial and Finals


var storage = require('./storage');
var inflows = require('./inflows');
var sink = require('./sink');
var netu = require('./utils/split');
var u = require('./utils');
var createSteps = require('./utils/createSteps');

module.exports = function(item, subnet) {
  var config = require('./mconfig')();
  var p = item.properties;
  var id = p.hobbes.id;
  var rows=[];

  // Look through flow, get boundaries
  // Need to get the boundaries from here.  But they
  // aren't expanded like the links where.  I guess you async.ForEach this?

  var time, step, steps = [];
  var e,edge;
  var inbound = netu.inboundTo(subnet, id);
  var outbound = netu.outboundFrom(subnet, id);
  var flow = item.properties.flow;
  if ( !flow ) {
    if( item.properties.storage ) {
      flow = item.properties.storage;
    } else {
      flow = createSteps();
    }
  }

  for (var flow_at_timestep_idx = 1; flow_at_timestep_idx < flow.length; flow_at_timestep_idx++) { // i=0 is header;
    step = flow[flow_at_timestep_idx][0];
    time = new Date(step).getTime();

    // Get boundary Conditions

    // if we're inside the time-based subset that we're supposed to process
    if ((!config.start || config.start < time) &&
      (!config.stop || time < config.stop)) {

      // attach the current timestep to the output
      steps.push(flow[flow_at_timestep_idx][0]);

      // Add Inflows from edge links
      // debugger;
      for (e = 0; e < inbound.length; e++) {
        edge = inbound[e].properties;
        //if( edge.flow.length >= flow_at_timestep_idx ) continue; // commented out as part of issue #1 in UCM repo
        
        rows.push([
          u.id('INBOUND', step),
          u.id(p.prmname, step),
          e, 
          0, 
          1, 
          u.roundBound(edge.flow[flow_at_timestep_idx][1]),
          u.roundBound(edge.flow[flow_at_timestep_idx][1])
        ]);
      }

      // Attach outbound boundary conditions
      for (e = 0; e < outbound.length; e++) {
        edge = outbound[e].properties;
        // if the outbound item has more total timesteps than the index of the current timestep, we skip it?
        //if( edge.flow.length >= flow_at_timestep_idx ) continue;  // has to do with regional exports, but *why* are we skipping it.
        // commented out as part of issue #1 in UCM repo

        rows.push([
          u.id(p.prmname, step),
          u.id('OUTBOUND', step),
          e, 
          0, 
          1, 
          u.roundBound(edge.flow[flow_at_timestep_idx][1]),
          u.roundBound(edge.flow[flow_at_timestep_idx][1])
        ]);
      }
    }
  }

  sink(item, steps, config).forEach(function (r) {
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
