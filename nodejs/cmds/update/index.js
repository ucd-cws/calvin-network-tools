'use strict';

var path = require('path');
var rimraf = require('rimraf');
var fs = require('fs');

var config = require('../../config').get();
var processData = require('./processData');
var runtime = require('../../lib/runtime');
var git = require('../../lib/git');
var utils = require('../../lib/utils');

var dirPreFix = 'dssExportJson';


module.exports = function(callback) {
  console.log('Running **Update** command.\n');

  var path = config.data;

  if( !path ) {
    console.log('No data path provided');
    process.exit(-1);
  }

  // make sure the repo is all checked in
  git.status(path, function(err, changes) {
    if( err ) {
      console.log('Error checking git status for: '+path);
      process.exit(-1);
    }
    if( changes.length > 0 ) {
      console.log('ERROR: your data directory must have a clean git status.');
      console.log('The data directory '+path+' has the following '+changes.length+' changes:\n');
      console.log(changes.join('\n'));
      console.log('Please commit changes, then try running "update" again');
      process.exit(-1);
    }

    run(callback);
  });
};

function run(callback) {
  var t = new Date().getTime();

  var root = utils.getWorkspacePath();

  var params = {
    export : true,
    path : path.join(root, config.prefix+'.dss'),
    exportRoot : path.join(root, dirPreFix+'_'+config.prefix),
    regex : config.regex || '.*FLOW_LOC.*'
  };

  if( config.cache && !config.cleanCache && fs.existsSync(params.exportRoot) ) {
    console.log(1);
    processData(params.exportRoot, function(){
      console.log('Finished update: '+(new Date().getTime() - t)+'ms');
      callback();
    });
    return;
  }

  cleanTmpDir(params.exportRoot, config.cleanCache, function() {
    // kill this file
    var dsc = path.join(rootDir, config.prefix+'.dsc');
    if( fs.existsSync(dsc) ) {
      fs.unlinkSync(dsc);
    }

    runtime(params, function(){
      processData(params.exportRoot, function(){
        console.log('Finished update: '+(new Date().getTime() - t)+'ms');
        cleanTmpDir(params.exportRoot, config.cache, function(){
          callback();
        });
      });
    });
  });
}

function cleanTmpDir(dir, clearCache, callback) {
  if( fs.existsSync(dir) && clearCache ) {
    console.log('cleaning dir: '+dir);
    rimraf(dir, callback);
  } else {
    callback();
  }
}
