'use strict';

// Given a link, and the time steps,
// return a list of every set of cost links at each timestep.
// List is in format of [cost,lb,ub]

var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
function getMonth(dateString) {
  var m = parseInt(dateString.split('-')[1])-1;
  return months[m];
}

// Given a penalty function, return a number of cost links
function penalty_costs(penalty) {
  var costs = [];
  var marg_cost, bound;

  // If Penalty function starts >0, push on a 0 cost
  // with a fixed bound if slope<0, no bound if slope>0
  if( penalty[1][0] > 0 ) {
    bound = penalty[1][0];
    marg_cost = (penalty[2][1] - penalty[1][1]) / bound;
    if (marg_cost < 0) {
      costs.push([0, penalty[1][0], penalty[1][0]]);
    } else {
      costs.push([0, 0, penalty[1][0]]);
    }
  }

  for( var i = 2; i < penalty.length; i++ ) {
    bound = penalty[i][0] - penalty[i-1][0];
    marg_cost = (penalty[i][1] - penalty[i-1][1]) / bound;
    costs.push([marg_cost, 0, bound]);
  }

  // Extrapolation above last cost.
  if (marg_cost < 0) {
    costs.push([0, 0, null]);
  } else {
    // extend last upperbound
    costs[costs.length-1][2]=null;
  }
  return costs;
}

module.exports = function(costs, steps) {
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
          step_cost.push([[0, 0, null]]);
        });
        return step_cost;

      case 'Constant':
        steps.forEach(function(time) {
          step_cost.push([[costs.cost,0,null]]);
        });
        return step_cost;

      case 'Monthly Variable':
        steps.forEach(function(time){
          month = getMonth(time);
           if( !month_cost[month] ) {
              penalty = costs.costs[month];
              month_cost[month] = penalty_costs(penalty);
           }
           step_cost.push(month_cost[month]);
        });
        return step_cost;

      case 'Annual Variable':
        steps.forEach(function(){
          month = 'JAN-DEC';
          if( !month_cost[month] ) {
            penalty = costs.costs[month];
            month_cost[month] = penalty_costs(penalty);
          }
          step_cost.push(month_cost[month]);
        });
        return step_cost;

      default :
        throw new Error('Bad Cost Type: '+costs.type);
    }
};
