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
      nodes : ["SR_WHI", "D5"],
      path : '/Users/jrmerz/dev/watershed/calvin-network-data/data'
    };

    matrix(config, function(matrix){
      console.log(matrix);
      console.log(matrix.length);
      next();
    });
  });

});
