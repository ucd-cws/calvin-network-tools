'use strict';

var async = require('async');
var fs = require('fs');
var parse = require('csv-parse');

var utils = require('./utils');

module.exports = function(start, stop, nodes, callback) {
  if( !start || !stop ) {
    return callback();
  }

  start = utils.toDate(start);

  // For storage parameters only, we actually want one additional time-step saved
  // this also properly sets the initial storage to the time-step before the start time
  start.setMonth(start.getMonth()-1);
  stop = utils.toDate(stop, true);


  function updateNode(node, next) {
    // update initial and ending storage if start and stop provided
    if( shouldUpdate(start, stop, node) ) {
      parse(fs.readFileSync(node.properties.storage.$ref, 'utf-8'), {comment: '#', delimiter: ','}, function(err, data){
        utils.trimDates(start, stop, data);

          if( data.length > 1 ){
          node.properties.initialstorage = parseFloat(data[1][1]);
          node.properties.endingstorage = parseFloat(data[data.length-1][1]);
        }
        next();
      });
    } else {
      next();
    }
  }

  async.eachSeries(nodes, updateNode, callback);
};

function shouldUpdate(start, stop, node ) {
  if( !start ) {
    return false;
  }
  if( !stop ) {
    return false;
  }
  if( !node.properties.storage ) {
    return false;
  }
  if( node.properties.type === 'Surface Storage' || node.properties.type === 'Groundwater Storage' ) {
    return true;
  }
  return false;
}
