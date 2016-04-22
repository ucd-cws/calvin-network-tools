'use strict';

var assert = require('assert');

describe('testing matrix', function() {

  var matrix;
  var config;

  before(function() {
    matrix = require('../../nodejs/matrix');

    config = {
      separator : ".",
      path : '/home/quinn/calvin-network-data/data',
      //path : '/Users/jrmerz/dev/watershed/calvin-network-data/data',
      start: '2001-08-01',
      end: '2001-10-01'
    };

  });

  it('Should match d94.csv', function(next) {
    this.timeout(10000);

    config.nodes=["D94"],
    matrix(config, function(matrix){
      matrix.forEach(function(r) {
      console.log(r.join(','));
      });
      next();
    });
  });

      it('Should match sr_whi.csv', function(next) {
    this.timeout(10000);

    config.nodes=["SR_WHI"],
    matrix(config, function(matrix){
      matrix.forEach(function(r) {
      console.log(r.join(','));
      });
      next();
    });
  });

});
