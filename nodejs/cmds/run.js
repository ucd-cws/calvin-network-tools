'use strict';

var spawn = require('child_process').spawn;
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

  var root = utils.getWorkspacePath();
  var prefix = path.join(root, config.prefix);

  var args = `${runtime} I=${prefix}.pri O=${prefix}.pro T=${prefix}TS.dss P=${prefix}PD.dss R=${prefix}.dss`;
  args = args.split(' ');

  if( os.type() === 'Windows_NT' ) {
    cmd = args.splice(0, 1)[0];
  }

  var child = spawn(cmd, args, {
    cwd: root,
    shell: '/bin/bash'
  });

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
