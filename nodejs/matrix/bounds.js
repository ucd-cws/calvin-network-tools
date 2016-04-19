'use strict';

var async = require('async');

// TODO: what value for no upper bound?
var MAX_UPPER_BOUND = 99999;

module.exports = function(network, matrixObjects, hnf, callback) {
  async.eachSeries(
    matrixObjects,
    function(node, next) {

      if( !node.properties.bounds ) {
        node.properties.lowerBound = 0;
        node.properties.upperBound = MAX_UPPER_BOUND;
      }

      var c = 0;
      async.eachSeries(
        node.properties.bounds,
        function(bound, cb) {
          if( bound.bound.$ref ) {
           hnf.expand(node, ['bounds.'+c+'.bound'], function() {
              c++;
              cb();
            });
          } else {
            c++;
            cb();
          }
        },
        function() {
          setBoundData(node);
          next();
        }
      );
    },
    function() {
      callback(matrixObjects);
    }
  );
};

// types to handle [ "UBM", "NOB", "UBC", "EQT", "LBC", "UBT", "LBM", "LBT" ]
function setBoundData(node) {
  var b, date;

  for( var i = 0; i < node.properties.bounds.length; i++ ) {
    b = node.properties.bounds[i];
    date = node.properties.id[1];

    if( b.type === 'NOB') {
      node.properties.lowerBound = 0;
      node.properties.upperBound = MAX_UPPER_BOUND;
      return;

    } else if( b.type === 'EQT') {
      node.properties.lowerBound = getDateValue(date, b.bound);
      node.properties.upperBound = node.properties.lowerBound;
      return;

    } else if( b.type === 'UBM') {
      node.properties.upperBound = getMonthValue(date, b.bound);
    } else if( b.type === 'LBM') {
      node.properties.lowerBound = getMonthValue(date, b.bound);

    } else if( b.type === 'UBT') {
      node.properties.upperBound = getDateValue(date, b.bound);
    } else if( b.type === 'LBT') {
      node.properties.lowerBound = getDateValue(date, b.bound);

    } else if( b.type === 'UBC') {
      node.properties.upperBound = b.bound;
    } else if( b.type === 'LBC') {
      node.properties.lowerBound = b.bound;
    }
  }

  if( node.properties.upperBound === undefined ) {
    node.properties.upperBound = MAX_UPPER_BOUND;
  }
  if( node.properties.lowerBound === undefined ) {
    node.properties.lowerBound = 0;
  }
}

function getMonthValue(date, data) {
  return getDateValue(getMonth(date), data);
}

function getDateValue(date, data) {
  for( var i = 0; i < data.length; i++ ) {
    if( data[i][0] === date ) {
      return data[i][1];
    }
  }
  return -1;
}

var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
function getMonth(dateString) {
  var m = parseInt(dateString.split('-')[1])-1;
  return months[m];
}
