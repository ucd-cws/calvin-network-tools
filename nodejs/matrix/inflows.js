'use strict'
/*
  Add Inflows, i,j,k,amp,cost,lb,ub into the system.  If inflow==0
  we won't add it in, so  this can always be called.  Returns 0 rows otherwise
*/
var u = require('./utils');

module.exports = function(item, steps) {
  var rows=[];
  var p=item.properties;
  var id=p.hobbes.id;

  if (p.inflows) {
    // This should be done for every inflow
    var inflow = p.inflows.default.inflow;
    var time;
    var row;
    var inflow_at={};
    var inf, i;

    // Lookup evap - could be faster
    inflow.forEach(function(e) {
      inflow_at[e[0]] = e[1];
    });

    for( i = 0; i < steps.length; i++ ){
      inf = inflow_at[steps[i]];
      // JM - fix for issue #37
      // if( typeof inf !=='undefined' && inf !== null && inf !== 0) {
      if( typeof inf !=='undefined' && inf !== null ) {
        rows.push([
          u.id('INFLOW',steps[i]),
          u.id(p.prmname, steps[i]),
          // JM - fixing issue #32.
          // old values: k=0, cost=1
          0,   // k
          0,   // cost
          1,   // amplitude
          inf, // lower bound
          inf  // upper bound
        ]);
      }
    }
  }

  return rows;
};
