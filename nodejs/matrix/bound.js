'use strict';

var async = require('async');

// Given a link, and the time steps,
// return the LB and UB at each timestep.
// List is in format of [lb,ub]

var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
function getMonth(dateString) {
  var m = parseInt(dateString.split('-')[1])-1;
  return months[m];
}

module.exports = function(link, steps, hnf, callback) {
    var steps_bound = [];
    var month, month_cost = {};
    var bounds,i,bound;

    var bm = []; // Temporary bounds
    var p = link.properties;

    // Start with no bounds
    steps.forEach(function(step) {
      steps_bound.push([0, null]);
    });

    var c = 0;
    async.eachSeries(
      p.bounds,
      function(bound, next) {
        c++;

        switch(bound.type) {
          case 'NOB':    // We are good
            return next();

          case 'LBC':
            for(i = 0; i <= steps.length; i++) {
              if( steps_bound[i][0] === null || steps_bound[i][0] < bound.bound ){
                steps_bound[i][0] = bound.bound;
              }
            }
            return next();

          case 'LBM':
          case 'LBT':
            hnf.expand(link, ['bounds.'+(c-1)+'.bound'], function(){
              bound = p.bounds[c-1];
              var b;

              bm = {};
              bound.bound.forEach(function(b) {
                  bm[b[0]] = b[1];
              });

              for(i = 0; i <= steps.length; i++) {
                  // Almost the same code for LBM and LBT
                  b = (bound.type === 'LBM') ? bm[getMonth(steps[i])] : bm[steps[i]];
                  if( (typeof b !== 'undefined' && b !== null) && (steps_bound[i][0] === null || steps_bound[i][0] < b) ){
                    steps_bound[i][0] = b;
                  }
              }

              next();
            });
            return;

          case 'UBC':
            for( i = 0; i <= steps.length; i++ ){
              if( steps_bound[i][1] === null || steps_bound[i][1] > bound.bound) {
                steps_bound[i][1] = bound.bound;
              }
            }
            return next();

          case 'UBM':
          case 'UBT':

            hnf.expand(link, ['bounds.'+(c-1)+'.bound'], function(){
              var b;
              bound = p.bounds[c-1];

              bm = {};
              bound.bound.forEach(function(b) {
                bm[b[0]] = b[1];
              });

              for( i = 0; i < steps.length; i++ ){
                // Almost the same code for BM and BT

                b = (bound.type === 'UBM') ? bm[getMonth(steps[i])] : bm[steps[i]];
                if( (typeof b === 'undefined' && b !== null ) && (steps_bound[i][1] === null || steps_bound[i][1] > b) ) {
                  steps_bound[i][1] = b;
                }
              }

              next();
            });
            return;

          case 'EQC':
            hnf.expand(link, ['bounds.'+(c-1)+'.bound'], function(){
              bound = p.bounds[c-1];
              var b;
              bm = {};

              bound.bound.forEach(function(b) {
                bm[b[0]] = b[1];
              });

              for( i = 0; i < steps.length; i++ ){
                b = bm[steps[i]];

                if( typeof b !=='undefined' && b !== null) {
                  if( steps_bound[i][0] === null || steps_bound[i][0] < b ) {
                    steps_bound[i][0] = b;
                  }
                  if( steps_bound[i][1] === null || steps_bound[i][1] > b ) {
                    steps_bound[i][1] = b;
                  }
                }
              }

              next();
            });
            return;

          default :
              throw new Error('Bad Bound Type: '+link.properties.hobbes.networkId);
          }
      },
      function(err) {
        callback(steps_bound);
      }
    );
};
