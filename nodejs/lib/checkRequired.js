'use strict';

var fs = require('fs');
var paths = ['config','data','runtime','workspace'];

module.exports = function(required) {
  var config = require('../config').get();

  required.forEach(function(arg){
    if( !config[arg] ) {
      console.log('Missing '+arg);
      process.exit(-1);
    }

    // if the arg is a path, make sure the path exists
    if( paths.indexOf(arg) > -1 ) {
      if( !fs.existsSync(config[arg]) ) {
        console.log('Invalid '+arg+' path: '+config[arg]);
        process.exit(-1);
      }
    }
  });


};
