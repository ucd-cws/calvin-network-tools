'use strict';

// Given a sink
// return a list of every sink

var cost = require('./cost');
var bound = require('./bound');
var netu = require('./split_utils');
var u = require('./utils');

function createSink(sink, id, steps) {
  var amp = 1;
  var step_costs;
  var step_bounds;
  var i,c;
  var rows = [];
  var u = require('./utils');

  var step_costs = cost(sink.costs||{type:"NONE"}, steps);
  var step_bounds = bound(sink.bounds||[], steps);

  var i;
  var lb,ub,costs;
  var clb,cub;

  for (i = 0; i < steps.length; i++) { // i=0 is header;
    lb = step_bounds[i][0];
    ub = step_bounds[i][1];
    costs = step_costs[i];

    for (c = 0; c < costs.length; c++) {
      //console.log(i+"/"+c+":"+costs[c]);
      // clb is greatest of item lower bound and cost lower bound
      // Make sure to satisfy item lb constraint, fill up each item till lb is met.
      // console.log('cost:' + c + ' lb:' + lb + 'clb:' + clb);

      if (ub === null) {
        clb = (costs[c][1] > lb)
          ? costs[c][1]
          : lb;
        lb -= clb;

        cub = costs[c][2];
      } else {
        clb = (costs[c][1] > lb)
          ? costs[c][1]
          : ((costs[c][2] || 0) <= lb)
            ? (costs[c][2] || 0)
            : lb;
        lb -= clb;

        cub = (costs[c][2] !== null && costs[c][2] <= ub) ? costs[c][2] : ub;
        ub -= cub;
      }

      // JM - including as part of issue #33 discussion
      //if (cub === null || cub > 0) {
        rows.push([
          u.id(id, steps[i]),
          u.id('SINK', steps[i]),
          c, costs[c][0], amp, clb, cub
        ]);
      //}
    }
  }

  return rows;
};

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
  var id = p.hobbes.networkId;
  var rows = []
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

        createSink(sink, id, steps).forEach(function (r) {
          rows.push(r);
        });
      }
    }
  }
  return rows;
};