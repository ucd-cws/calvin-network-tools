'use strict';

var assert = require('assert');

describe('testing cnf-matrix', function() {

  var matrix;
  var config;

  before(function() {
    matrix = require('../../nodejs/matrix');

    config = {
      separator : ".",
      path : '/home/quinn/calvin-network-data/data',
      //path : '/Users/jrmerz/dev/watershed/calvin-network-data/data',
      start: '2001-09-15',
      end: '2002-10-15'
    };

  });

  it('Should Print a BIG file', function(next) {
    this.timeout(1000000);

    config.nodes=["A101", "C2", "C5", "C87", "CVPM01G", "CVPM01S",
    "D5", "D73", "D74", "D94", "EXT_REDDIN", "GW_01",
    "HGP01", "HGR01", "HNP101", "HP101", "HSD101", "HSU101D5", "HSU101D74", "HSU101SR3", "HU101",
    "HXI101", "INT_REDDIN", "SR_CLE", "SR_SHA", "SR_WHI", "U101", "WTP101"];
//    "WWP101"];
//  config.nodes=["wwp101"];

    matrix(config, function(matrix){
      matrix.forEach(function(r) {
        if (r[6] == null) { r[6]=1000000; } 
	  console.log(r.join('	'));
      });
      next();
    });
  });
});
