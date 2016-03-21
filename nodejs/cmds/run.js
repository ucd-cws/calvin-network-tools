'use strict';

var spawn = require('child_process').spawn;
var colors = require('colors');
var os = require('os');
var path = require('path');

var checkRequired = require('../lib/checkRequired');
var config = require('../config').get();

var required = ['runtime', 'prefix'];

module.exports = function(callback) {
  console.log('Running **Run** command.\n');
  var cmd = 'wine';

  checkRequired(required);

  var runtime = path.join(config.runtime, 'hecprm.exe');
  var prefix;
  if( config.workspace ) {
    prefix = path.join(config.workspace, config.prefix);
  } else {
    prefix = config.prefix;
  }

  var args = `${runtime} I=${prefix}.pri O=${prefix}.pro T=${prefix}TS.dss P=${prefix}PD.dss R=${prefix}.dss`;
  args = args.split(' ');

  if( os.type() === 'Windows_NT' ) {
    cmd = args.splice(0, 1)[0];
  }

  var child = spawn(cmd, args);

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
