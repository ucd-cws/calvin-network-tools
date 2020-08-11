'use strict';

// Given a sink
// return a list of every sink

var cost = require('./cost');
var bound = require('./bound');
var stepCost = require('./utils/stepCost');
var u = require('./utils');

function createSink(sink, id, prmname, steps) {
  var amp = 1;
  var step_costs;
  var step_bounds;
  var i,k;
  var rows = [];
  var u = require('./utils');

  // JM - for issue #33
  // It seems like the bounds function overrides itself...
  // just looking at first bound
  var isConstrained = false;
  var bounds = sink.bounds || [];
  if( bounds.length > 0 ) {
    var boundType = bounds[0].type;
    if( boundType === 'EQC' ||  boundType === 'EQT' || boundType === 'EQM' ) {
      isConstrained = true;
    }
  }

  var step_bounds = bound(sink.bounds||[], steps);
  var step_costs = cost(sink.costs||{type:"NONE"}, step_bounds, steps, id);

  var i;
  var stepBounds,costs;
  var stepCostResult;

  for (i = 0; i < steps.length; i++) { // i=0 is header;
    stepBounds = step_bounds[i];
    costs = step_costs[i];

    for (k = 0; k < costs.length; k++) {

      stepCostResult = stepCost(costs[k], stepBounds, costs);

      rows.push([
        u.id(prmname, steps[i]),
        u.id('SINK', steps[i]),
        k, 
        u.roundCostAmp(costs[k].cost), 
        u.roundCostAmp(amp), 
        u.roundBound(isConstrained ? stepCostResult.cub : stepCostResult.clb), 
        u.roundBound(stepCostResult.cub)
      ]);

    }
  }

  return rows;
}

function stepsFromSink(flow, config) {
  var steps = [], time, step;
  
  for (var i = 1; i < flow.length; i++) { // i=0 is header;
    step = flow[i][0];
    time = new Date(step).getTime();

    // Get boundary Conditions
    if ((!config.start || config.start < time) &&
      (!config.stop || time < config.stop)) {

      steps.push(flow[i][0]);
    }
  }

  return steps;
}


module.exports = function (item, steps, config) {
  var p = item.properties;
  var id = p.hobbes.id;
  var rows = [];
  var i, sinkName, sink;

  if (p.sinks) {

    for (i = 0; i <= p.sinks.length; i++) {
      for (sinkName in p.sinks[i]) {
        sink = p.sinks[i][sinkName];

        // JM
        // fix for issue #33 where there is no flow to another node, instead
        // it's a direct flow to a sink
        if( steps.length === 0 && sink.flow && sink.flow.length > 0 ) {
          steps = stepsFromSink(sink.flow, config);
        }

        createSink(sink, id, p.prmname, steps).forEach(function (r) {
          rows.push(r);
        });
      }
    }
  }
  return rows;
};