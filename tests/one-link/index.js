'use strict';

var assert = require('assert');

describe('testing matrix', function() {

  var matrix;

  before(function() {
    matrix = require('../../nodejs/matrix');
  });

  it('should test function', function(next) {
    this.timeout(10000);

    var config = {
      nodes : ["SR_WHI-D5"],
      path : '/home/quinn/calvin-network-data/data',
      //path : '/Users/jrmerz/dev/watershed/calvin-network-data/data',
      start: '2001-07-01',
      end: '2001-09-01'
    };

    matrix(config, function(matrix){
//      console.log(matrix);
      matrix.forEach(function(r) {
      console.log(r.join(','));
      });
      next();
    });
  });

});
