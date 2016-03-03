'use strict';

var fs = require('fs');

module.exports = function(dir) {
  return JSON.parse(fs.readFileSync(dir, 'utf-8').replace(/\r|\n/g,''));
};
