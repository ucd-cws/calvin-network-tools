'use strict';

var path = require('path');
var rimraf = require('rimraf');
var fs = require('fs');
var runtime = require('../lib/runtime');

module.exports = function(args, callback) {
  console.log('Running **Update** command.\n');

  var params = {
    export : true,
    path : path.join(args.output || process.cwd(), args.prefix+'.dss'),
    exportRoot : path.join(args.output || process.cwd())
  };

  var dir = path.join(params.exportRoot, 'dssExportJson');

  cleanTmpDir(dir, function(){
    runtime(args.runtime, params, args, function(){
      console.log('Finished update');
      callback();
    });
  });
};

function cleanTmpDir(dir, callback) {
  if( fs.existsSync(dir) ) {
    console.log('cleaning dir: '+dir);
    rimraf(dir, callback);
  } else {
    callback();
  }
}
