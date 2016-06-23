'use strict';

var exec = require('child_process').exec;
var colors = require('colors');
var os = require('os');
var path = require('path');

var utils = require('../lib/utils');
var checkRequired = require('../lib/checkRequired');
var config = require('../config').get();

var required = ['runtime', 'prefix'];

module.exports = function(callback) {
  console.log('Running **Run** command.\n');
  var cmd = 'wine';

  checkRequired(required);

  var runtime = path.join(config.runtime, 'hecprm.exe');

  var cwd = utils.getWorkspacePath();
  var prefix = path.join(cwd, config.prefix);

  var cmd = `${runtime} I=${prefix}.pri O=${prefix}.pro T=${prefix}TS.dss P=${prefix}PD.dss R=${prefix}.dss`;
  cmd = cmd.split(' ');

  var cmdOptions = {
    maxBuffer: 1024 * 100000, 
    cwd: cwd
  }

  // use bash and wine if not on windows
  if( os.type() !== 'Windows_NT' ) {
    cmd.unshift('wine');
    cmdOptions.shell = '/bin/bash';
  }

    // run
  if( config.verbose ) {
    console.log(`\n${cwd}`);
    console.log(`${cmd.join(' ')}\n`);
    console.log(cmdOptions);
  }

  var child = exec(cmd.join(' '), cmdOptions);

  child.stdout.on('data', (data) => {
    if( data instanceof Buffer ) {
      console.log(data.toString('utf-8'));
    } else {
      console.log(data);
    }
  });

  child.stderr.on('data', (data) => {
    console.log(colors.red(data));
  });

  child.on('close', (code) => {
    console.log('hecprm.exe exited with code '+code);
    console.log('done.');
    callback();
  });

};
