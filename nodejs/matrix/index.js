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

//var hnf = require('hobbes-network-format');
var hnf = require('../../../hobbes-network-format');
var async = require('async');

var link=require('./link');

function matrix(config, callback) {

    console.log('Reading network...');
    hnf.split(config.path, {}, config.nodes, function(network) {
	var rows_for={};
	var inflow_source={};

	async.eachSeries(
            network.in,
            function(item,next) {
		var p=item.properties;
		var id=p.hobbes.networkId;
		var inf_at; // INFLOW names
		var row;
		if( p.hobbes.type === 'node' ) {
		    //=node(item,hnf,inflow_source);
		    if (p.inflows ) {
			rows_for[id]=[];
			hnf.expand(item, ['inflows.default.inflow'], function(){
			    var inflow = item.properties.inflows.default.inflow;
			    
			    for( var i = 1; i < inflow.length; i++ ) {
				if (( ! config.start || config.start<inflow[i][0]) &&
				    (! config.end || inflow[i][0]<config.end)) {
				    inf_at=['INFLOW',inflow[i][0]].join('@');
				    inflow_source[inf_at]++;
				    row=[inf_at,
					 [id,inflow[i][0]].join('@'),
					 0,1,
					 inflow[i][1],
					 inflow[i][1]].join(',');
				    rows_for[id].push(row);
				}
			    }
			});
		    }
		} else {  // Link
		    console.log('LinK');
		    console.log(link(item,hnf,config));
		    console.log('Linked');
		    rows_for[id]=link(item,hnf,config);
		}
		next();
            },
            function() {
		var i;
		var rows=[];
		console.log(config.start);
		// Add Inflows
		Object.keys(inflow_source).forEach(function(key) {
		    rows.unshift(['SOURCE',key,0,1,null,null].join(','));
		});
		for (var i in rows_for) {
		    rows_for[i].forEach(function(r) { rows.push(r) });
		}
		//rows.forEach(function(r) { console.log(r) });
		callback(rows);
            }
	);
    });
}

module.exports = matrix;
