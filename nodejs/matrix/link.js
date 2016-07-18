'use strict';

// Given a link
// return a list of every set of cost links at each timestep.
// How do you get the total number of links to make? You can grab the flow?

var cost = require('./cost');
var bound = require('./bound');
var netu = require('./split_utils');
var u=require('./utils');

module.exports = function(link, subnet) {
  var config = require('./mconfig')();
  var steps = [];
  var p = link.properties;
  var id= p.hobbes.networkId;
  var amp = p.amplitude;
  var step_costs;
  var step_bounds;
  var i,c;
  var rows = [];

  var flow = link.properties.flow;
  var time,step;

  for( i = 1; i < flow.length; i++ ) { // i=0 is header;
    step = flow[i][0];
    time = new Date(step).getTime();
    // Get boundary Conditions
    if( ( !config.start || config.start < time) && ( !config.stop || time < config.stop) ) {
      steps.push(flow[i][0]);

      if (netu.is_inbound(subnet,p.origin)) {
        rows.push([
          u.id('INBOUND',step),
          u.id(p.origin,step),
          0,0,1,flow[i][1],flow[i][1]]);
        }
        if (netu.is_outbound(subnet,p.terminus)) {
          rows.push([
            u.id(p.terminus,step),
            u.id('OUTBOUND',step),
            0,0,1,flow[i][1],flow[i][1]]);
          }
        }
      }

      var step_costs = cost(link.properties.costs||{type:"NONE"}, steps);
      var step_bounds = bound(link.properties.bounds||[], steps);

      var i;
      var lb,ub,costs;
      var clb,cub;

      for(i = 0; i < steps.length; i++ ) { // i=0 is header;
        lb = step_bounds[i][0];
        ub = step_bounds[i][1];
        costs = step_costs[i];

        for( c = 0; c < costs.length; c++ ){
          //console.log(i+"/"+c+":"+costs[c]);
          // clb is greatest of link lower bound and cost lower bound
          // Make sure to satisfy link lb constraint, fill up each link till lb is met.
          clb=( costs[c][1] > lb )
          ? costs[c][1]
          : ( (costs[c][2] || 0) <= lb )
          ? (costs[c][2] || 0)
          : lb;

          lb -= clb;
          if (ub===null) {
            cub=costs[c][2];
          } else {
            cub = ( costs[c][2]!==null && costs[c][2] <= ub ) ? costs[c][2] : ub;
            ub -= cub;
          }

          // JM
          // fix for second part of issue #2
          // need to include links that have 0 upper bound for mass balance
          //if (cub===null || cub>0) {
            rows.push([
              u.id(p.origin, steps[i]),
              u.id(p.terminus, steps[i]),
              c, costs[c][0], amp, clb, cub
            ]);
          //}
        }
      }

      return rows;
    };
