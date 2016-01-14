'use strict';

var async = require('async');
var date = require('../cmds/date');
var fs = require('fs');
var parse = require('csv-parse');

module.exports = function(start, stop, nodes, callback) {
  if( !start || !stop ) {
    return callback();
  }

  start = date.toDate(start);
  // For storage parameters only, we actually want one additional time-step saved
  // this also properly sets the initial storage to the time-step before the start time
  start.setMonth(start.getMonth()-1);
  stop = date.toDate(stop, true);

  async.eachSeries(
    nodes,
    function(node, next){
      // update initial and ending storage if start and stop provided
	//      if( (node.properties.type === 'Surface Storage' || node.properties.type === 'Groundwater Storage')
	if(node.properties.type === 'Surface Storage' && node.properties.storage && start && stop) {

        parse(fs.readFileSync(node.properties.storage, 'utf-8'), {comment: '#', delimiter: ','}, function(err, data){
          date.trim(start, stop, data);

            if( data.length > 1 ){
//		console.log(data);
            node.properties.initialstorage = parseFloat(data[1][1]);
            node.properties.endingstorage = parseFloat(data[data.length-1][1]);
          }
//	    console.log(node);

          next();
        });
      } else {
        next();
      }
    },
    callback
  );
};
