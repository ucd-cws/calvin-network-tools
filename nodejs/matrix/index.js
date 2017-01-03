// matrix prints out the required matrix inputs for any given set of nodes
// or links
// The matrix is i,j,k,c,a,l,u
// where i = origin
// j= terminal
// k = link number
// c = cost
// a = itamplitude
// l = lower bound
// u = upper bound

'use strict';

var async = require('async');
var hnf = require('../hnf')();
var expand = require('./utils/expand');
var link = require('./link');
var node = require('./node');
var debug = require('../lib/debug');

function matrix(config, callback) {
  require('./mconfig')(config); // set the config
  //    console.log('Reading network...');

  if( config.start ) {
    config.start = new Date(config.start).getTime();
  }
  if( config.stop ) {
    config.stop = new Date(config.stop).getTime();
  }

  var opts = {
    /**
     * We don't want to parse any $refs, yet
     */
    onlyParse : function(file) {
      return false;
    },
    getId : function(properties) {
      return properties.prmname;
    }
  }

  hnf.split(config.data, opts, config.nodes, function (subnet) {
    if (subnet.in.length === 0) {
      subnet.in = subnet.out;
    }

    // remove all disabled nodes
    ['in', 'out'].forEach((type) => {
      var l = subnet[type].length;
      for( var i = l-1; i >= 0; i-- ) {
        if( subnet[type][i].properties.disabled ) {
          subnet[type].splice(i, 1);
        }
      }
    });

    // JM
    // Attempting to add debug for issue #34
    if( config.debug ) {
      subnet.in = debug(subnet.in);
    }

    expand(subnet, function(){

      // JM - same as above
      // Attempting to add debug for issue #34
      if( config.debug ) {
        addFlowsToDebug(subnet);
      }

      onSubnetReady(subnet, config, callback);
    });
  }); // end split
}

function onSubnetReady(subnet, config, callback) {
  var rows_for = {};
  var inflow_source = {};
  // Links to source and SINK
  var inbound={};
  var outbound={};
  var final=false;
  var initial=false;

  require('./utils').initNodeLookup(subnet.in);

  subnet.in.sort(function(a, b){
    if( a.properties.prmname > b.properties.prmname ) return 1;
    if( a.properties.prmname < b.properties.prmname ) return -1;
    return 0;
  }); 

  subnet.in.forEach(function(item){
    var p = item.properties;
    var id = p.hobbes.id;

    if( p.hobbes.type === 'node' ) {
      rows_for[id] = node(item, subnet);
    } else {
      rows_for[id] = link(item, subnet);
    }
  });


  var i;
  var rows = [];

  for( i in rows_for ) {
    rows_for[i].forEach(function(r) {

      if ( r[0].indexOf("INITIAL") === 0 && !initial) {
        rows.push(['SOURCE',r[0],0,0,1,0,null]);
        initial=true;
      }
      if ( r[1].indexOf("FINAL") === 0 && !final) {
        rows.push([r[1],'SINK',0,0,1,0,null]);
        final=true;
      }

      if ( (r[0].indexOf("INFLOW")===0 ||
            r[0].indexOf("INBOUND")===0 ) && ! inbound[r[0]]) {
        rows.push(['SOURCE',r[0],0,0,1,0,null]);
        inbound[r[0]]=true;
      }
      if ((r[1].indexOf("OUTBOUND")===0 ||
           r[1].indexOf("SINK")===0 ) && ! outbound[r[1]]) {
        rows.push([r[1],'SINK',0,0,1,0,null]);
        outbound[r[1]]=true;
      }

      rows.push(r);
    });
  }
  callback(rows);
}

function addFlowsToDebug(subnet) {
  // now we need to fake the flows so we add rows to the matrix
  var dates = {}, p;
  for( var i = 0; i < subnet.in.length; i++ ) {
    p = subnet.in[i].properties;
    if( !p.flow ) continue;
    
    for( var j = 1; j < p.flow.length; j++ ) {
      dates[p.flow[j][0]] = true;
    }
  }

  var flow = Object.keys(dates);
  flow.sort();
  flow.unshift('');

  for( var i = 0; i < flow.length; i++ ) {
    flow[i] = [flow[i], 0];
  }

  for( var i = 0; i < subnet.in.length; i++ ) {
    if( subnet.in[i].properties.hobbes.debug ) {
      subnet.in[i].properties.flow = flow;
      subnet.in[i].properties.amplitude = 1;
    }
  }
}


module.exports = matrix;
