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
      path : '/home/quinn/calvin-network-data/data',
      start: '2000-10',
      end: '2001-05'
    };

    matrix(config, function(matrix){
      console.log(matrix);
      console.log(matrix.length);
      next();
    });
  });

});
