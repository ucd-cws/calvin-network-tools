'use strict';

// is this installed in a node_modules dir?
// is this version not equal to npm latest?

var fs = require('fs');
var colors = require('colors/safe');
var exec = require('child_process').exec;

module.exports = function(callback) {
  var cancel = false;

  var tid = setTimeout(function(){
    cancel = true;
    callback();
  }, 5000);

  exec('npm view --json calvin-network-tools', {},
    function (error, stdout, stderr) {
      if( cancel ) {
        return;
      }
      clearTimeout(tid);

      if( error || stderr ) {
        console.log(colors.red('\n** Unable to verify package version **\n'));
        return callback();
      }

      var info = eval('('+stdout+')');
      var cInfo = require('../../package.json');

      if( info['dist-tags'].latest !== cInfo.version ) {
        console.log(colors.yellow('\n**** CNF Update Available ****'));
        console.log(colors.yellow('* Your version is '+cInfo.version));
        console.log(colors.yellow('* Current version is '+info['dist-tags'].latest));
        console.log(colors.yellow('* Run "cnf library update" to update'));
        console.log(colors.yellow('******************************\n'));
      }

      callback();
    }
  );
};
