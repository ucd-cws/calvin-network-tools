'use strict';

// Given a sink
// return a list of every sink

var cost = require('./cost');
var bound = require('./bound');
var netu = require('./split_utils');


function sink(sink, id,steps) {
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

  for(i = 0; i < steps.length; i++ ) { // i=0 is header;
    lb = step_bounds[i][0];
    ub = step_bounds[i][1];
    costs = step_costs[i];

    for( c = 0; c < costs.length; c++ ){
      //console.log(i+"/"+c+":"+costs[c]);
      // clb is greatest of item lower bound and cost lower bound
      // Make sure to satisfy item lb constraint, fill up each item till lb is met.
      console.log('cost:'+c+' lb:'+lb+'clb:'+clb);

      if (ub===null) {
        clb=( costs[c][1] > lb )
        ? costs[c][1]
        : lb;
        lb -= clb;

        cub=costs[c][2];
        } else {
          clb=( costs[c][1] > lb )
          ? costs[c][1]
          : ( (costs[c][2] || 0) <= lb )
          ? (costs[c][2] || 0)
          : lb;
          lb -= clb;

          cub = ( costs[c][2]!==null && costs[c][2] <= ub ) ? costs[c][2] : ub;
          ub -= cub;
          }

          if (cub===null || cub>0) {
            rows.push([
              [id, steps[i]].join('@'),
              ['SINK', steps[i]].join('@'),
              c, costs[c][0], amp, clb, cub
              ]);
              }
              }
              }

              return rows;
            };

            module.exports = function (item,steps) {
              var p=item.properties;
              var id=p.hobbes.networkId;
              var rows=[]
              var i,s;

              if (p.sinks) {
                for (i=0;i<=p.sinks.length;i++) {
                  for (s in p.sinks[i]) {
                    sink(p.sinks[i][s],id,steps).forEach(function(r) {
                      rows.push(r);
                      });
                      }
                      }
                      }
                      return rows;
                    };
