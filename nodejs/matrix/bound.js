'use strict';

// Given a bound list and the time steps,
// return the LB and UB at each timestep.
// List is in format of {LB:lb,UB:ub}

var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
function getMonth(dateString) {
  var m = parseInt(dateString.split('-')[1])-1;
  return months[m];
}

module.exports = function(bounds, steps, callback) {
    var steps_bound = [];
    var month, month_cost = {};
    var i,bound;

    var bm = []; // Temporary bounds

    // Start with no bounds
    steps.forEach(function(step) {
      // lb, ub, lb defined
      steps_bound.push([0, null, false]);
    });

    var c = 0;
    bounds.forEach(function(bound, index){
      switch(bound.type) {
        case 'NOB':    // We are good
          return;

        case 'LBC':
          for(i = 0; i < steps.length; i++) {
            if( steps_bound[i][0] === null || steps_bound[i][0] < bound.bound ){
              steps_bound[i][0] = bound.bound;
              steps_bound[i][2] = true;
            }
          }
          return;

        case 'LBM':
        case 'LBT':
          var b;

          bm = {};
          bound.bound.forEach(function(b) {
              bm[b[0]] = b[1];
          });
          for(i = 0; i < steps.length; i++) {
              // Almost the same code for LBM and LBT
              b = (bound.type === 'LBM') ? bm[getMonth(steps[i])] : bm[steps[i]];
              if( (typeof b !== 'undefined' && b !== null) && (steps_bound[i][0] === null || steps_bound[i][0] < b) ){
                steps_bound[i][0] = b;
                steps_bound[i][2] = true;
              }
          }
          return;

        case 'UBC':
          for( i = 0; i < steps.length; i++ ){
            if( steps_bound[i][1] === null || steps_bound[i][1] > bound.bound) {
              steps_bound[i][1] = bound.bound;
            }
          }
          return;

        case 'UBM':
        case 'UBT':
          bm = {};
          bound.bound.forEach(function(b) {
            bm[b[0]] = b[1];
          });

          for( i = 0; i < steps.length; i++ ){
            // Almost the same code for BM and BT

            b = (bound.type === 'UBM') ? bm[getMonth(steps[i])] : bm[steps[i]];
            if( (typeof b !== 'undefined' && b !== null ) && (steps_bound[i][1] === null || steps_bound[i][1] > b) ) {
              steps_bound[i][1] = b;
            }
          }
          return;

        case 'EQT':
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
                  steps_bound[i][2] = true;
                }
                if( steps_bound[i][1] === null || steps_bound[i][1] > b ) {
                  steps_bound[i][1] = b;
                }
              }
            }
          return;

        default :
            throw new Error('Bad Bound Type: '+bound.type);
        }
    });

    return steps_bound.map((bound) => {
      return {
        LB : bound[0],
        UB : bound[1],
        LBDefined : bound[2]
      }
    });
};
