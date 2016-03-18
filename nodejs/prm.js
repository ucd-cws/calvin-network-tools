'use strict';

var program = require('commander');
var sprintf = require('sprintf-js').sprintf;
var async = require('async');

var fileConfig = require('./lib/fileConfig');
var checkVersion = require('./lib/checkVersion');
var run = require('./run');

program
  .version(require('../package.json').version)
  .arguments('[command(s)]')
  .option('-c, --config [path]', 'Path to .prmconf file.  Defaults to home dir.')
  .option('-p, --prefix [prefix name]', 'prefix name for build')
  .option('-d, --data [repo/path/data]', 'path to Calvin Network /data folder')
  .option('-r, --runtime [path]', 'path to Calvin HEC Runtime')
  .option('-w, --workspace [path]', 'directory to read/write all dss/hec-prm files')
  .option('-s, --start [YYYY-MM]', 'Specify start date for TimeSeries data')
  .option('-t, --stop [YYYY-MM]', 'Specify stop date for TimeSeries data')
  .option('-g, --regex', 'Optional flag for \'update\' command. regex to use when selecting dss path values to write back to repo.')
  .option('-L  --clean-cache', 'Optional flag for \'update\' command. clears local update cache')
  .option('-l  --cache', 'Optional flag for \'update\' command. cache data read from dss file in local json file')
  .option('-v, --verbose', 'Verbose output, including hec-dss library output')
  .option('-d, --debug', 'Set debug nodes.  Either "ALL", "*" or comma seperated list of prmnames (no spaces)')
  .option('-D, --debug-cost', 'set cost for debug nodes (default: 2000000)')
  .option('-S, --show-data', 'Optional flag for \'show-build\' command, will print the csv file data as well')
  .option('-x, --excel-path', 'flag for \'excel\' command, path to excel file to use')
  .option('-R, --debug-runtime', 'Keeps the PRM NodeJS json file used to pass information to the dssWriter (Calvin HEC Runtime) jar')
  .option('-n, --no-initialize', 'Do not initialize the nodes/links (overrides initialize parameter)')
  .option('-i, --initialize', 'Initialize parameter for nodes/links (default: init)')
  .option('-a, --args', 'dump the program arguments');

var format = '%4.4s%-29.29s %s';
var cmds = ['init', 'crawl', 'build', 'run', 'show', 'list', 'show-build', 'excel', 'update-library','update'];

program.on('--help', function(){
  console.log('  Commands:');
  console.log('');
  console.log(sprintf(format, '','init','Initialize the .prmconf file.  Downloads runtime if needed.'));
  console.log(sprintf(format, '','build','Write CSV data files to ts and pd dss file. Requires the Calvin HEC Runtime'));
  console.log(sprintf(format, '','run','Run the hecprm.exe program with provided prefix files. Wine is required (non-windoz).'));
  console.log(sprintf(format, '','update','Apply results from dss file back to data repo'));
  console.log(sprintf(format, '','show [prmname] ...','Print a list of nodes as they are represented in the pri files. Pass \'ALL\' to print everything.'));
  console.log(sprintf(format, '','list [prmname] ...','Print all nodes/link. Pass \'ALL\' to print everything.'));
  console.log(sprintf(format, '','crawl','run hobbes-network-format crawler'));
  console.log(sprintf(format, '','show-build','Print the JSON that will be passed to the DssWrite'));
  console.log(sprintf(format, '','update-library','Update the Calvin HEC Runtime'));
  console.log(sprintf(format, '','excel','apply calvin-network-app excel download changes to repo'));
  console.log('');
  console.log('  More Info:');
  console.log('    See the github repo & README: https://github.com/ucd-cws/calvin-network-tools');
  console.log('');
});

program.parse(process.argv);

// parse out non-commands, assume the are nodes for show/list command
var nodes = [];
for( var i = program.args.length-1; i >= 0; i-- ) {
  if( cmds.indexOf(program.args[i]) === -1 ) {
    nodes.push(program.args.splice(i, 1)[0]);
  }
}
program.nodes = nodes;

// if nothing todo, leave, drop some help
if( program.args.length === 0 ) {
  console.log('\nNo valid command provided\n');
  process.argv.push('--help');
  program.parse(process.argv);
  return;
}

// read arguments from config file;
fileConfig(program);

// stash program arguments.
require('./config').set(program);


// dump all args if user wants
if( program.args ) {
  console.log('*** PRM Arguments ***');
  for( var key in program ) {
    var type = typeof program[key];
    if( type === 'string' || type === 'boolean' ) {
      console.log('  '+key+': '+program[key]);
    }
  }
  console.log('**********************\n');
}

checkVersion(function(){
  async.eachSeries(
    program.args,
    function(cmd, next) {
      run(cmd, next);
    },
    function(err) {
      // done with all cmds
      if( program.verbose ) {
        console.log('\nPRM COMPLETE');
      }
    }
  );
});
