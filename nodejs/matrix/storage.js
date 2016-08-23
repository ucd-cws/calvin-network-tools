'use strict';

/* Given a storage node
return a list of every set of cost storage links at each timestep.
*/

var cost = require('./cost');
var bound = require('./bound');
var netu = require('./split_utils');
var evaporation = require('./evaporation');
var u=require('./utils');

module.exports = function(stor, steps) {
  var p = stor.properties;
  var id= p.hobbes.networkId;
  var step_costs;
  var step_bounds;
  var i,c;
  var rows = [];

  // Assume there IS a storage, otherwise, we need steps!
  var cap = p.storage;

  // Boundary conditions
  var initial=p.initialstorage;
  var ending=p.endingstorage;
  var first=null;
  var last=null;

  var step_keys={};
  steps.forEach(function(s){step_keys[s]=1;});

  // Get initial and Final storage capacities
  for( i = 1; i < cap.length; i++ ) { // i=0 is header;
    if (step_keys[cap[i][0]]) {
      if (! first) {
        if (i>1) initial=cap[i-1][1];
        first++;
      }
      last=i;
    }
  }
  if (last !==cap.length-1) {
    ending=cap[last][1];
  }

  // Add Initial [i,j,k,cost,amplitude,lower,upper]
  rows.push(['INITIAL',u.id(id,steps[0]),0,0,1,initial,initial]);

  var step_costs = cost(p.costs, steps);
  var step_bounds = bound(p.bounds, steps);
  var step_amp = evaporation(stor, steps);
  var i;
  var lb,ub,costs;
  var clb,cub;
  var amp;
  var next;

  for(i = 0; i < steps.length; i++ ) { // i=0 is header;
    lb = step_bounds[i][0];
    ub = step_bounds[i][1];
    costs = step_costs[i];
    amp=step_amp[i];

    if(i===steps.length-1) { // Fixed to final storage
      // JM fix for issue 35
      if( ending === null ) {
        lb = 0;
      } else {
        lb = ending;
      }
      ub = ending;

      next='FINAL';
      rows.push([u.id(id,steps[i]),next,0,0,1,lb,ub]);
    } else {
      next=u.id(id,steps[i+1]);
      for( c = 0; c < costs.length; c++ ){
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

        if (cub===null || cub>0) {
          rows.push([u.id(id,steps[i]),next,
          c, costs[c][0], amp, clb, cub
        ]);
      }
    }
  }
}

return rows;
};
