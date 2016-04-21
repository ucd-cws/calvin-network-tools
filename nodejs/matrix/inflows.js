'use strict'
/*
  Add Inflows, i,j,k,amp,cost,lb,ub into the system.  If inflow==0
  we won't add it in, so  this can always be called.  Returns 0 rows otherwise
*/

module.exports = function(item,steps,hnf,callback) {
  var rows=[];
  var p=items.properties;

  if (p.inflows) {
    // This should be done for every inflow
    hnf.expand(item, ['inflows.default.inflow'],function(){
      var inflow = p.inflows.default.inflow;
      var time;
      var row;
      var inflow_at={};
      var inf;

      // Lookup evap - could be faster
      inflow.forEach(function(e) {
        inflow_at[e[0]] = e[1];
      });

      for( i = 0; i < steps.length; i++ ){
        inf = inflow_at[steps[i]];
        if( typeof inf !=='undefined' && inf !== null && inf !== 0) {
          rows.push([
            u.id('INFLOW',steps[i]),
            u.id(id,steps[i]),
            0,1,inf,inf]);
          );
        }
      }
      callback(rows);
    });
  } else {
    callback(rows);
  }
};
