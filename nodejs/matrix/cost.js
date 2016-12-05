'use strict';

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

  var lastBound;
  for( var i = 2; i < penalty.length; i++ ) {
    bound = penalty[i][0] - penalty[i-1][0];
    lastBound = penalty[i][0];
    marg_cost = (penalty[i][1] - penalty[i-1][1]) / bound;

    costs.push({
      cost: marg_cost, 
      lb : 0, 
      ub: bound
    });
  }

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

    if( bounds.LBDefined ) {
      if( costs[0].lb !== bounds.LB ) {
        costs[0].lb = bounds.LB;
        
        // need to adjust the ub as well.
        if( penalty.length >= 3 ) {
          costs[0].ub = penalty[2][0];
        }
        if( LOCAL_DEBUG ) console.log(`${prmname}: s<0 && LB, setting k=0 lb to LB`);
        updated = true;
      }
    } else {
      costs[0].lb = 0;
      if( penalty.length >= 3 ) {
        costs[0].ub = penalty[2][0];
      }

      if( LOCAL_DEBUG ) console.log(`${prmname}: s<0 && !LB, Setting k=0 lb to 0`);
      updated = true;
    }

    if( exists(bounds.UB) ) {
      if( lastBound < bounds.UB ) {
        costs.push({
          lb   : 0,
          ub   : bounds.UB - lastBound,
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

  } else {

    if( bounds.LBDefined ) {
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

      if( costs[0].lb !== 0 ) {
        if( LOCAL_DEBUG ) {
          console.log(`${prmname}:  s>1 && !LB`);
          if( prmname.indexOf('-') > -1 ) {
            console.log(`  WARNING This should never happen! `);
          }
        }

        costs.unshift({
          cost : 0, 
          lb : 0, 
          ub : costs[0].lb
        });
        updated = true;
      }
    }

    if( exists(bounds.UB) ) {
      if( costs[costs.length-1].ub !== bounds.UB ) {
        costs[costs.length-1].ub = bounds.UB;
        if( LOCAL_DEBUG ) console.log(`${prmname}: s>0 && UB, Setting k=K ub to UB`);
        updated = true;
      }
    } else {
      var c = costs[costs.length-1];

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
          penalty = costs.costs[month];
          step_cost.push(penalty_costs(penalty, bounds[index], prmname));
        });
        return step_cost;

      case 'Annual Variable':
        steps.forEach(function(step, index){
          month = 'JAN-DEC';
          penalty = costs.costs[month];
          step_cost.push(penalty_costs(penalty, bounds[index], prmname));
        });
        return step_cost;

      default :
        throw new Error('Bad Cost Type: '+costs.type);
    }
};