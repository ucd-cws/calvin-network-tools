'use strict';

var parse = require('csv-parse');
var fs = require('fs');

module.exports = function(file, object, attr, parseCsvData, callback) {
  if( file.match(/.*\.csv$/i) ) {
    if( !parseCsvData ) {
      object[attr] = file;
      setImmediate(callback);
      return;
    }

    object[attr] = fs.readFileSync(file, 'utf-8');

    parse(object[attr], {comment: '#', delimiter: ','}, function(err, data){
      if( attr === '' ) { // hack need to fix
        if( global.debug ) {
          console.log('  --Attempting to set empty attr name, switching to "data": '+file);
        }
        delete object[attr];
        attr = 'data';
      }

      if( err ) {
        object[attr] = err;
      } else {
        object[attr] = parseInts(data);
      }
      setImmediate(callback);
    });
  } else {
    object[attr] = fs.readFileSync(file, 'utf-8');
    setImmediate(callback);
  }
};

var numMatch1 = /^-?\d+\.?\d*$/;
var numMatch2 = /^-?\d*\.\d+$/;
var numMatch3 = /^-?\d*\.?\d*e-?\d+$/;

function parseInts(data) {
  for( var i = 0; i < data.length; i++ ) {
    for( var j = 0; j < data[i].length; j++ ) {
      if( data[i][j].match(numMatch1) || data[i][j].match(numMatch2) || data[i][j].match(numMatch3) ) {
        var t = Number(data[i][j]);
        if( !isNaN(t) ) {
          data[i][j] = t.valueOf();
        }
      }
    }
  }
  return data;
}
