'use strict';

var path = require('path');
var rimraf = require('rimraf');
var fs = require('fs');
var processData = require('./processData');
var runtime = require('../../lib/runtime');
var dirPreFix = 'dssExportJson';

module.exports = function(args, callback) {
  console.log('Running **Update** command.\n');
  var t = new Date().getTime();

  var params = {
    export : true,
    path : path.join(args.output || process.cwd(), args.prefix+'.dss'),
    exportRoot : path.join(args.output || process.cwd(), dirPreFix+'_'+args.prefix),
    regex : args.regex || '.*FLOW_LOC.*'
  };

  if( args.cache && !args['clean-cache'] && fs.existsSync(params.exportRoot) ) {
    processData(params.exportRoot, args, function(){
      console.log('Finished update: '+(new Date().getTime() - t)+'ms');
      callback();
    });
    return;
  }

  cleanTmpDir(params.exportRoot, args['clean-cache'], function() {
    // kill this file
    var dsc = path.join(args.output || process.cwd(), args.prefix+'.dsc');
    if( fs.existsSync(dsc) ) {
      fs.unlinkSync(dsc);
    }

    runtime(args.runtime, params, args, function(){
      processData(params.exportRoot, args, function(){
        console.log('Finished update: '+(new Date().getTime() - t)+'ms');
        cleanTmpDir(params.exportRoot, args.cache, function(){
          callback();
        });
      });
    });
  });
};

function cleanTmpDir(dir, clearCache, callback) {
  if( fs.existsSync(dir) && clearCache ) {
    console.log('cleaning dir: '+dir);
    rimraf(dir, callback);
  } else {
    callback();
  }
}
