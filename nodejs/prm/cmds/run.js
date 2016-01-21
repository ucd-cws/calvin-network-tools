'use strict';

var spawn = require('child_process').spawn;
var colors = require('colors');
var os = require('os');

var cmd = 'wine';
var argsTemplate = '{{runtime}}/hecprm.exe I={{prefix}}.pri O={{prefix}}.pro '+
          'T={{prefix}}TS.dss P={{prefix}}PD.dss R={{prefix}}.dss';


module.exports = function(argv) {
  var args = argsTemplate.replace(/{{runtime}}/, argv.runtime);
  args = args.replace(/{{prefix}}/g, argv.prefix).split(' ');

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
    console.log('finished.');
  });

};
