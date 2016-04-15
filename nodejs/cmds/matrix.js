// matrix prints out the required matrix inputs for any given set of nodes
// or links
// The matrix is i,j,k,c,a,l,u
// where i = origin
// j= terminal
// k = link number
// c = cost
// a =amplitude
// l = lower bound
// u = upper bound


'use strict';

var crawler = require('hobbes-network-format');
var parse = require('csv-parse');
var fs=require('fs');

var updateStorage = require('../lib/updateStorage');
var pri = require('../pri');
var debug = require('../lib/debug');
var link = require('../pri/format/link');
var path = require('path');
var config = require('../config').get();

var callback;

module.exports = function(cb) {
  if( config.verbose ) {
    console.log('Running **'+config.nodeCmdType+'** command.\n');
  }

  callback = cb;

  if( !config.nodes && !config.debug ) {
    console.log('Please provide a nodes to '+config.nodeCmdType);
    return callback();
  }

  if( !config.data ) {
    console.log('Please provide a data repo location');
    return callback();
  }
    matrix()
};


function matrix() {
  var nodes = config.nodes;
  var datapath = config.datapath;

  var o = {};
  if( config['no-initialize'] ) {
    o.initialize = false;
  } else {
    o.initialize = config.initialize !== undefined ? config.initialize : 'init';
  }

  for (var i = 0 ; i < nodes.length; i++) {
    nodes[i] = nodes[i].toUpperCase();
  }

  var pridata = pri.init();

  crawler(config.data, {parseCsvData : false}, function(results){
    var node, i;
    var list = [];

    if( config.debug ) {
      list = debug(results.nodes.features);
    } else {
      for( i = 0; i < results.nodes.features.length; i++ ) {
        node = results.nodes.features[i];
        if( nodes[0] === '' || nodes[0].toUpperCase() === 'ALL' || nodes.indexOf(node.properties.prmname.toUpperCase()) > -1 ) {
          list.push(node);
        }
      }
    }

      function parse_csv(fn,callback) {
	  var err,data;
	  var csv=fs.readFileSync(fn,'utf-8');
	  parse(csv,{comment: '#', delimiter: ',' },function(err,data) {
	      if( err ) {
		  data=null;
	      } else {
//		  data = parseInts(data);
	      }
	      setImmediate(function() { callback(err,data);});
	  });
      }

      // Need to consider what updateStorge does with times
      for( var i = 0; i < list.length; i++ ) {
	  var net=list[i].properties;
	  if ((config.matrixB || true) && net.inflows) {
	      for (var key in net.inflows) {
		  var fn=net.inflows[key].inflow;
		  if (fn.match(/.*\.csv$/)) {
		      parse_csv(fn,function(err,data) {
			  data.forEach(function(d) {
			      console.log([[net.prmname,d[0]].join('@'),d[1]].join(','));
			  });
		      });
		  }
      }
	  }
	  if (config.matrixA || true ) {
	      console.log('A');
	  }
	  if (config.matrixC || true ) {
	      console.log('C');
	  }
      }
      callback();
  });
}
