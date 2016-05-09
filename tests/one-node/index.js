'use strict';

var assert = require('assert');
var fs = require('fs');

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

  ["D94", "SR_WHI"].forEach(
    function (link) {
      var name = link.toLowerCase();
      var data = [];

      it('Should match '+name+'.tab', function (next) {
        this.timeout(10000);

        config.nodes = [link],
          matrix(config, function (matrix) {
            matrix.forEach(function (r) {
              if (r[6] === null) {
                r[6]=1000000;
              }
              var line = r.join("\t");
              data.push(line);
              console.log(line);
            });
            if (false) {
              fs.writeFileSync(name + '.dat', data.join("\n")+"\n");
            }
            next();
          });
      });
    });
});
