'use strict';

// The following Nodes are included in the formulation
// Any node with an inflow is added
// Any storage node flows from timestep to timestep
// Storage Nodes have Initial and Finals

module.exports = function(item,hnf,config,callback) {
  var node=[];
  var inflows={};
  if (item.properties.inflows) {
    hnf.expand(item, ['inflows.default.inflow'],function(){
      var inflow = item.properties.inflows.default.inflow;
      var time;
      var inf_at;
      var row;
      var id=item.properties.hobbes.networkId;

      for( var i = 1; i < inflow.length; i++ ) {
        time = new Date(inflow[i][0]);

        if( ( !config.start || config.start < time ) && (!config.end || time < config.end) ) {
          inf_at = ['INFLOW', inflow[i][0]].join('@');
          inflows[inf_at] = true;

          row = [
            inf_at,
            [id, inflow[i][0]].join('@'),
            0,1,inflow[i][1],inflow[i][1]
          ];
          node.push(row);
        }
      }
      callback({inflows:inflows,rows:node});
    });
    } else {
      callback({inflows:{},rows:[]});
    }
}
