'use strict';
/**
 * Wrapper for the running the hec java runtime located:
 * https://github.com/ucd-cws/calvin-network-data/releases
 */

var fs = require('fs');
var os = require('os');
var colors = require('colors');
var path = require('path');
var exec = require('child_process').exec;

var config = require('../config').get();
var utils = require('../lib/utils');

// temp file.  we write the JSON to a temp file which is then read in
// by the jar and parsed using the jackson lib.
var PARAMS_TMP_FILE = '.dssWriterParams';

module.exports = function(params, options, callback) {
  if( typeof options === 'function' ) {
    callback = options;
  }

  // create tmp file in current working directory
  var paramFile = path.join(utils.getWorkspacePath(), PARAMS_TMP_FILE);
  fs.writeFileSync(paramFile, JSON.stringify(params, '  ', '  '));

  // run the custom dssWriter jar using the packaged java (Win 32bit), HEC's java lib and HEC's system DLL's
  // (DLL's supplied with -Djava.library.path).  The jar takes as it's first parameter the path to the tmp file.
  var cmd = [
      'java.exe',
      '-Djava.library.path="'+path.join(config.runtime,'lib')+';${env_var:PATH}"',
      '-jar',
      path.join(config.runtime,'dssWriter.jar'),
      paramFile
  ];
  // if we are not running in windows, we need to use wine.
  if( os.type() !== 'Windows_NT' ) {
    cmd.unshift('wine');
  }

  // set current working directory of the exec env to the runtime/jre/bin path.
  // This makes working with wine a little easier.
  var cwd = path.join(config.runtime, 'jre', 'bin');

  // run
  if( config.verbose ) {
    console.log(cwd);
    console.log(cmd.join(' '));
  }

  var child = exec(cmd.join(' '), {maxBuffer: 1024 * 100000, cwd: cwd, shell: '/bin/bash'});
  child.stdout.on('data', (data) => {
    if( !config.verbose ) {
      return;
    }
    console.log(data.replace(/\n$/,''));
  });
  child.stderr.on('data', (data) => {
    if( !config.verbose ) {
      return;
    }
    console.log(colors.red(data.replace(/\n$/,'')));
  });

  child.on('close', (code) => {
    // first thing after program runs, remove the tmp file
    if( config.debugRuntime !== true ) {
      fs.unlinkSync(paramFile);
    }

    callback();
  });
};
