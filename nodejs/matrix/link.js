'use strict';

// Given a link
// return a list of every set of cost links at each timestep.
// How do you get the total number of links to make? You can grab the flow?

var cost = require('./cost');
var bound = require('./bound');
var netu = require('./utils/split');
var u = require('./utils');
var stepCost = require('./utils/stepCost');
var createSteps = require('./utils/createSteps');

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
  }

  for( i = 1; i < flow.length; i++ ) { // i=0 is header;
    step = flow[i][0];
    time = new Date(step).getTime();

    // Get boundary Conditions
    if( ( !config.start || config.start < time) && ( !config.stop || time < config.stop) ) {
      steps.push(flow[i][0]);

      if (netu.isInbound(subnet, p.hobbes.origin)) {
        rows.push([
          u.id('INBOUND',step),
          u.id(u.getNodeById(p.hobbes.origin).properties.prmname, step),
          0,0,1,flow[i][1],flow[i][1]
        ]);
      }
      if (netu.isOutbound(subnet, p.hobbes.terminus)) {
          rows.push([
            u.id(u.getNodeById(p.hobbes.terminus).properties.prmname, step),
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
        (p.hobbes.origin === 'SOURCE') ? 'SOURCE' : u.id(getPrmname(p.hobbes.origin), steps[i]),
        u.id(getPrmname(p.hobbes.terminus), steps[i]),
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

function getPrmname(id) {
  var node = u.getNodeById(id);
  if( node ) return node.properties.prmname;
  return id;
}