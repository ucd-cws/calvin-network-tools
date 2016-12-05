'use strict';

// Given a link
// return a list of every set of cost links at each timestep.
// How do you get the total number of links to make? You can grab the flow?

var cost = require('./cost');
var bound = require('./bound');
var netu = require('./split_utils');
var u = require('./utils');
var stepCost = require('./stepCost');
var createSteps = require('./createSteps');

module.exports = function(link, subnet) {
  var config = require('./mconfig')();
  var steps = [];
  var p = link.properties;
  var id = p.hobbes.id;
  var amp = p.amplitude;
  var step_costs;
  var step_bounds;
  var i, k;
  var rows = [];

  var flow = link.properties.flow;
  var time, step;

  if( flow.length === 0 ) {
    flow = createSteps();
    console.log(link.properties.prmname);
  }

  for( i = 1; i < flow.length; i++ ) { // i=0 is header;
    step = flow[i][0];
    time = new Date(step).getTime();
    // Get boundary Conditions
    if( ( !config.start || config.start < time) && ( !config.stop || time < config.stop) ) {
      steps.push(flow[i][0]);

      if (netu.is_inbound(subnet,p.origin)) {
        rows.push([
          u.id('INBOUND',step),
          u.id(p.hobbes.origin,step),
          0,0,1,flow[i][1],flow[i][1]
        ]);
      }
      if (netu.is_outbound(subnet,p.terminus)) {
          rows.push([
            u.id(p.hobbes.terminus,step),
            u.id('OUTBOUND',step),
            0,0,1,flow[i][1],flow[i][1]
          ]);
      }
    }
  }

  // JM - for issue #33
  // It seems like the bounds function overrides itself...
  // just looking at first bound
  var isConstrained = false;
  var bounds = link.properties.bounds || [];
  if( bounds.length > 0 ) {
    var boundType = bounds[0].type;
    if( boundType === 'EQC' ||  boundType === 'EQT' || boundType === 'EQM' ) {
      isConstrained = true;
    }
  }

  var step_bounds = bound(link.properties.bounds||[], steps);
  var step_costs = cost(link.properties.costs||{type:"NONE"}, step_bounds, steps, link.properties.prmname);

  var i;
  var stepBounds,costs;
  var stepCostResult;

  for(i = 0; i < steps.length; i++ ) { // i=0 is header;
    stepBounds = step_bounds[i];
    costs = step_costs[i];

    for( k = 0; k < costs.length; k++ ){

      stepCostResult = stepCost(costs[k], stepBounds, costs);

      rows.push([
        ( p.origin === 'SOURCE' ) ? 'SOURCE' : u.id(p.origin, steps[i]),
        u.id(p.terminus, steps[i]),
        k, 
        costs[k].cost, 
        amp, 
        isConstrained ? stepCostResult.cub : stepCostResult.clb, 
        stepCostResult.cub
      ]);

    }
  }

  return rows;
};
