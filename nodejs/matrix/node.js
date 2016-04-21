'use strict';

// The following Nodes are included in the formulation
// Any node with an inflow is added
// Any storage node flows from timestep to timestep
// Storage Nodes have Initial and Finals

module.exports = function(item,hnf,config,split,callback) {
  var p = item.properties;
  var id = p.hobbes.networkId;
  var u = require('./utils')(config);
  var rows=[];

  // Look through flow, get boundaries
  // Need to get the boundaries from here.  But they
  // aren't expanded like the links where.  I guess you async.ForEach this?

  hnf.expand(link, ['flow'], function(){
    var flow = link.properties.flow;
    var time,step;

    for( i = 1; i < flow.length; i++ ) { // i=0 is header;
      step = flow[i][0];
      time = new Date(step).getTime();
      // Get boundary Conditions
      if( ( !config.start || config.start < time) && ( !config.end || time < config.end) ) {
        steps.push(flow[i][0]);

        // For every link that is in an edge, you need to add as an inbound here
        // Every edge is a new k.
        if (netu.is_inbound(split,p.origin)) {
          rows.push([
            u.id('INBOUND',step),
            u.id(p.origin,step),
            0,0,1,flow[i][1],flow[i][1]]);
        }
        if (netu.is_outbound(split,p.terminus)) {
          rows.push([
            u.id(p.terminus,step),
            u.id('OUTBOUND',step),
            0,0,1,flow[i][1],flow[i][1]]);
        }
      }
    }

  // If there is a storage, than we have a reservior.
  // Strange, if we call storage with steps, that makes things a bit more confusing
// in returning the initial and final storages.    
  if (p.storage) {
    storage(item,hnf,config,function(rows) {
      var steps=[];
      rows.forEach(function(r){
        steps.push(r[0]);
      });
      inflows(item,steps,hnf,function(more_rows) {
        more_rows.forEach(function(r){
          rows.push(r);
        });
        callback(rows);
      }
    });
  } else {
    // I guess no storage, so we just add inflows to our steps.
    // here Rows are all the above boundary conditions.
    inflows(item,steps,hnf,function(more_rows) {
      more_rows.forEach(function(r){
        rows.push(r);
      });
      callback(rows);
  }
