'use strict';

var config = require('../config').get();

// Given a link, and the time steps,
// return a list of every set of cost links at each timestep.
// List is in format of [cost,lb,ub]

var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
function getMonth(dateString) {
  var m = parseInt(dateString.split('-')[1])-1;
  return months[m];
}

// Given a penalty function, return a number of cost links
function penalty_costs(penalty, bounds) {
  var costs = [];
  var marg_cost, bound;

  // If Penalty function starts >0, push on a 0 cost
  // with a fixed bound if slope<0, no bound if slope>0
  if( penalty[1][0] > 0 ) {
    bound = penalty[1][0];
    marg_cost = (penalty[2][1] - penalty[1][1]) / bound;

    // negative slope
    if (marg_cost < 0) {
      costs.push({
        cost : 0, 
        lb : penalty[1][0], 
        ub : penalty[1][0]
      });

    // positive slope
    } else {
      costs.push({
        cost : 0, 
        lb : 0, 
        ub : penalty[1][0]
      });
    }
  }

  for( var i = 2; i < penalty.length; i++ ) {
    bound = penalty[i][0] - penalty[i-1][0];
    marg_cost = (penalty[i][1] - penalty[i-1][1]) / bound;
    costs.push({
      cost: marg_cost, 
      lb : 0, 
      ub: bound
    });
  }

  // Extrapolation above last cost.
  if (marg_cost < 0) {
    costs.push({
      cost : 0, 
      lb : 0, 
      ub: null
    });
  } else {
    // extend last upperbound
    costs[costs.length-1].cost = null;
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

  if( isNegativeSlope ) {

    if( exists(bounds.LB) ) {
      costs[0].lb = bounds.LB;
    } else {
      costs[0].lb = 0;
    }

    if( exists(bounds.UB) ) {
      costs[costs.length-1].ub = bounds.UB;
    } else {
      var p = penalty[penalty.length-1];
      var c = costs[costs.length-1];

      costs.push({
        cost : c.cost,
        lb : c.lb,
        ub : xIntercept(p[0], p[1], c.cost)
      });

      if( isNaN(costs[costs.length].ub) ) {
        costs[costs.length].ub = null; // ?
      }
    }

  } else {

    if( exists(bounds.LB) ) {
      costs[0].lb = bounds.LB;
    } else {
      console.warn('This should never happen!');
      costs.push({
        cost : 0, 
        lb : 0, 
        ub : null
      });
    }

    if( exists(bounds.UB) ) {
      costs[costs.length-1].ub = bounds.UB;
    } else {
      var c = costs[costs.length-1];

      costs.push({
        cost : c.cost,
        lb : c.lb,
        ub : config.maxUb || 1e9
      });
    }

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

module.exports = function(costs, bounds, steps) {
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
        steps.forEach(function(time){
          month = getMonth(time);
           if( !month_cost[month] ) {
              penalty = costs.costs[month];
              month_cost[month] = penalty_costs(penalty, bounds);
           }
           step_cost.push(month_cost[month]);
        });
        return step_cost;

      case 'Annual Variable':
        steps.forEach(function(){
          month = 'JAN-DEC';
          if( !month_cost[month] ) {
            penalty = costs.costs[month];
            month_cost[month] = penalty_costs(penalty, bounds);
          }
          step_cost.push(month_cost[month]);
        });
        return step_cost;

      default :
        throw new Error('Bad Cost Type: '+costs.type);
    }
};