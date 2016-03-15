'use strict';

// stash the commander object for global use
var config;

module.exports = {
  get : function() {
    return config;
  },
  set : function(commander) {
    config = commander;
  }
};
