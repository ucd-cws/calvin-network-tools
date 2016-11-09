'use strict';
var extend = require('extend');
var config = require('../config').get();
var LOCAL_DEBUG = false;

// Given a link, and the time steps,
// return a list of every set of cost links at each timestep.
// List is in format of [cost,lb,ub]

var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
function getMonth(dateString) {
  var m = parseInt(dateString.split('-')[1])-1;
  return months[m];
}

// Given a penalty function, return a number of cost links
function penalty_costs(penalty, bounds, prmname) {
  var costs = [];
  var marg_cost, bound;

  // DONT DELETE
  // If Penalty function starts >0, push on a 0 cost
  // with a fixed bound if slope<0, no bound if slope>0
  // if( penalty[1][0] > 0 ) {
  //   bound = penalty[1][0];
  //   marg_cost = (penalty[2][1] - penalty[1][1]) / bound;

  //   // negative slope
  //   if (marg_cost < 0) {
  //     costs.push({
  //       cost : 0, 
  //       lb : penalty[1][0], 
  //       ub : penalty[1][0]
  //     });

  //   // positive slope
  //   } else {
  //     costs.push({
  //       cost : 0, 
  //       lb : 0, 
  //       ub : penalty[1][0]
  //     });
  //   }
  // }

  for( var i = 2; i < penalty.length; i++ ) {
    bound = penalty[i][0] - penalty[i-1][0];
    marg_cost = (penalty[i][1] - penalty[i-1][1]) / bound;

    costs.push({
      cost: marg_cost, 
      lb : 0, 
      ub: bound
    });
  }

  // DONT DELETE
  // Extrapolation above last cost.
  // if (marg_cost < 0) {
  //   costs.push({
  //     cost : 0, 
  //     lb : 0, 
  //     ub: null
  //   });
  // } else {
  //   // extend last upperbound
  //   costs[costs.length-1].cost = null;
  // }

  // TODO: adding logic here for ISSUE #36
  // Now does solutions for ISSUE #36 invalidate above statements?
  var isNegativeSlope = false;
  for( var i = 0; i < costs.length; i++ ) {
    c = costs[i];
    if( c.cost < 0 ) {
      isNegativeSlope = true;
      break;
    }
  }

  if( costs[0] === 0  ) {
    if( costs.length > 1 ) {
      if( LOCAL_DEBUG ) console.log(`${prmname}: Slope 0 but multiple k`);
    }
    return;
  }

  var updated = false;

  if( isNegativeSlope ) {

    if( exists(bounds.LB) ) {
      if( costs[0].lb !== bounds.LB ) {
        costs[0].lb = bounds.LB;
        if( LOCAL_DEBUG ) console.log(`${prmname}: s<0 && LB, setting k=0 lb to LB`);
        updated = true;
      }
    } else {
      if( costs[0].lb !== 0 ) {
        costs[0].lb = 0;
        if( LOCAL_DEBUG ) console.log(`${prmname}: s<0 && !LB, Setting k=0 lb to 0`);
        updated = true;
      }
    }

    if( exists(bounds.UB) ) {
      if( costs[costs.length-1].ub < bounds.UB ) {
        costs.push({
          lb   : 0,
          ub   : bounds.UB - costs[costs.length-1].ub,
          cost : 0
        });
       }
    } else {
      costs.push({
        lb   : 0,
        ub   : config.maxUb || 1e9,
        cost : 0
      });
    }

    // if( exists(bounds.UB) ) {

    //   if( costs[costs.length-1].ub !== bounds.UB ) {
    //     costs[costs.length-1].ub = bounds.UB;
    //     if( LOCAL_DEBUG ) console.log(`${prmname}: s<0 && UB, setting k=K to UB`);
    //     updated = true;
    //   }

    // } else if( penalty[penalty.length-1][1] != 0 ){ // JM

    //   if( LOCAL_DEBUG ) console.log(`${prmname}: s<0 && !UB, Extending k, ub = xIntercept`);

    //   var p = penalty[penalty.length-1];
    //   var c = costs[costs.length-1];

    //   costs.push({
    //     cost : c.cost,
    //     lb : c.lb,
    //     ub : xIntercept(p[0], p[1], c.cost)
    //   });

    //   updated = true;

    //   if( isNaN(costs[costs.length-1].ub) ) {
    //     if( LOCAL_DEBUG ) console.log(`  WARNING ub is now NaN ${p[0]}, ${p[1]}, ${c.cost}!!!!!`);
    //     costs[costs.length-1].ub = null; // ?
    //   }
    // }

  } else {

    if( exists(bounds.LB) ) {
      if( costs[0].lb !== bounds.LB ) {
        costs[0].lb = bounds.LB;
        
        if( LOCAL_DEBUG ) {
          console.log(`${prmname}: s>0 && LB, Setting k=0 lb to LB`);
          if( prmname.indexOf('-') > -1 ) {
            console.log(` WARNING This should never happen!`);
          }
        }
        updated = true;
      }
    } else {
      if( LOCAL_DEBUG ) {
        console.log(`${prmname}:  s>1 && !LB`);
        if( prmname.indexOf('-') > -1 ) {
          console.log(`  WARNING This should never happen! `);
        }
      }

      costs.push({
        cost : 0, 
        lb : 0, 
        ub : null
      });
      updated = true;
    }

    if( exists(bounds.UB) ) {
      if( costs[costs.length-1].ub !== bounds.UB ) {
        costs[costs.length-1].ub = bounds.UB;
        if( LOCAL_DEBUG ) console.log(`${prmname}: s>0 && UB, Setting k=K ub to UB`);
        updated = true;
      }
    } else {
      var c = costs[costs.length-1];

      // Remove for possible fix for issue #36
      // set to maxium w/o adding another k
      // costs.push({
      //   cost : c.cost,
      //   lb : c.lb,
      //   ub : config.maxUb || 1e9
      // });
      costs[costs.length-1].ub = config.maxUb || 1e9;

      if( LOCAL_DEBUG ) {
        console.log(`${prmname}: s>0 && !UB, Extending k to ub=${1e9}`);
        if( prmname.indexOf('-') > -1 ) {
          console.log(` WARNING This should never happen!`);
        }
      }
      updated = true;
    }
  }

  if( updated && LOCAL_DEBUG ) {
    console.log(costs);
  }

  return costs;
}

function xIntercept(x, y, slope) {
  var b = y - slope * x;
  return -1 * ( b / slope);
}

function exists(val) {
  return (val !== undefined && val !== null);
}

// prmname is for debug
module.exports = function(costs, bounds, steps, prmname) {
    var step_cost = [];
    var penalty;
    var month, month_cost = {};

    if (! costs || ! costs.type) {
      costs = {};
      costs.type='None';
    }
    switch(costs.type) {
      case 'NONE':
      case 'None':
        steps.forEach(function(time) {
          step_cost.push([{
            cost : 0, 
            lb : 0, 
            ub : null
          }]);
        });
        return step_cost;

      case 'Constant':
        steps.forEach(function(time) {
          step_cost.push([{
            cost : costs.cost,
            lb : 0,
            ub : null
          }]);
        });
        return step_cost;

      case 'Monthly Variable':
        steps.forEach(function(time, index){
          month = getMonth(time);
           if( !month_cost[month] ) {
              penalty = costs.costs[month];
              month_cost[month] = penalty_costs(penalty, bounds[index], prmname);
           }
           step_cost.push(month_cost[month]);
        });
        return step_cost;

      case 'Annual Variable':
        steps.forEach(function(step, index){
          month = 'JAN-DEC';
          if( !month_cost[month] ) {
            penalty = costs.costs[month];
            month_cost[month] = penalty_costs(penalty, bounds[index], prmname);
          }
          step_cost.push(month_cost[month]);
        });
        return step_cost;

      default :
        throw new Error('Bad Cost Type: '+costs.type);
    }
};