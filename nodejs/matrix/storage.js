'use strict';

// Given a storage node
// return a list of every set of cost storage links at each timestep.
// How do you get the total number of storage links to make?
// We are grabbing the storage.

var cost = require('./cost');
var bound = require('./bound');
var netu=require('./split_utils');
var evaporation=require('./evaporation');

module.exports = function(stor, hnf, config,callback) {
    var steps = [];
    var p = stor.properties;
    var id= p.hobbes.networkId;
    var amp = p.amplitude;
    var step_costs;
    var step_bounds;
    var i,c;
    var rows = [];

    var u=require('./utils')(config);

    // Assume there IS a storage, otherwise, we need steps!
    hnf.expand(stor, ['storage'], function(){
      var cap = p.storage;
      var time,step;

      // Boundary conditions
      var initial;
      var ending;
      var first=null;
      var last=null;

      for( i = 1; i < cap.length; i++ ) { // i=0 is header;
        step = cap[i][0];
        time = new Date(step).getTime();
        // Get boundary Conditions
        if ( ( !config.start || config.start < time) &&
             ( !config.end || time < config.end) ) {
          if (first===null) { first=i; }
          steps.push(cap[i][0]);
          last=i;
        }
      }
      // set initial / final
      if (first===1) {
        initial=p.initialstorage;
      } else {
        initial=cap[i-1][1];
      }
      if (last===cap.length-1) {
        ending=p.endingstorage;
      } else {
        ending=cap[i+1][1];
      }

      // Add Initial [i,j,k,cost,amplitude,lower,upper]
      rows.push(['INITIAL',u.id(id,steps[0]),0,0,1,initial,initial]);

      cost(stor, steps, hnf, function(step_costs){
        bound(stor, steps, hnf, function(step_bounds){
          evaporation(stor,steps,hnf function(step_amp){
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
              lb=final;
              ub=final;
              next='FINAL';
            } else {
              next=u.id(id,steps[i+1]);
            }

            for( c = 0; c < costs.length; c++ ){
              //console.log(i+"/"+c+":"+costs[c]);
              // clb is greatest of stor lower bound and cost lower bound
              // Make sure to satisfy stor lb constraint, fill up each stor till lb is met.
              clb=(costs[c][1]>lb)?costs[c][1]:((costs[c][2]||0)<=lb)?(costs[c][2]||0):lb;
              lb-=clb;
              cub=(costs[c][2]>=ub)?costs[c][2]:ub;
              ub-=clb;

              rows.push([u.id(id,step),next,
                c,costs[c][0],amp,clb,cub]);
            }
          }
          callback(rows);
        }); // end evaporation
        }); // end bounds
      }); // end costs
    }); // end expand
  };
