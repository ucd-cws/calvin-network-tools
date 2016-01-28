'use strict';

var argv = require('minimist')(process.argv.slice(2));
var async = require('async');
var run = require('./runCmd');
var checkVersion = require('./checkVersion');
var docsUrl = 'https://github.com/ucd-cws/calvin-network-tools#commands';

var cmds = ['init', 'crawl', 'build', 'run', 'show', 'list', 'showBuild', 'excel', 'update-library'];

var noCommand = false;
if( !argv._ ) {
  noCommand = true;
} else if ( argv._.length === 0 ) {
  noCommand = true;
}

if( noCommand ) {
  return console.log('Please provide a command.\nSee docs here: '+docsUrl);
}

checkVersion(function(){
  var nodes = [];
  for( var i = argv._.length-1; i >= 0; i-- ) {
    if( cmds.indexOf(argv._[i]) === -1 ) {
      nodes.push(argv._.splice(i, 1)[0]);
    }
  }
  argv.nodes = nodes;

  async.eachSeries(
    argv._,
    function(cmd, next) {
      run(cmd, argv, docsUrl, next);
    },
    function(err) {
      // done with all cmds
    }
  );
});
