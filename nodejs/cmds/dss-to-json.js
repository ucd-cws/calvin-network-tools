'use strict';

var path = require('path');
var rimraf = require('rimraf');
var fs = require('fs');

var config = require('../config').get();
var runtime = require('../lib/runtime');
var utils = require('../lib/utils');

var dirPreFix = 'dssExportJson';

module.exports = function(callback) {
  console.log('Running **DSS to JSON** command.\n');

  var fpath = config.file;

  if( !fpath ) {
    console.log('No dss path provided');
    process.exit(-1);
  }

  run(callback);
};

function run(callback) {

  var root = utils.getWorkspacePath();

  var params = {
    export : true,
    path : path.join(root, config.file),
    exportRoot : path.join(root, config.file.replace(/.dss$/i,'')+'_json'),
    regex : config.regex || '.*'
  };

  // kill this file
  var dsc = path.join(root, config.file.replace(/.dss$/i,'')+'.dsc');
  if( fs.existsSync(dsc) ) {
    fs.unlinkSync(dsc);
  }

  cleanTmpDir(params.exportRoot, function() {
    runtime(params, function(){
      console.log('done.');
    });
  });
}

function cleanTmpDir(dir, callback) {
  if( fs.existsSync(dir)  ) {
    console.log('cleaning dir: '+dir);
    rimraf(dir, callback);
  } else {
    callback();
  }
}
