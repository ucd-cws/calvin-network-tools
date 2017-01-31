'use strict';

var HEC_VERSION = 'v1.4';

var request = require('superagent');
var Spinner = require('cli-spinner').Spinner;
var AdmZip = require('adm-zip');
var rimraf = require('rimraf');
var fs = require('fs');
var path = require('path');
var readline = require('readline');
var utils = require('../lib/utils');

var runtimeZip = path.join(__dirname, '..', '..', 'HEC_Runtime.zip');
var runtimeFolder = path.join(__dirname, '..', '..', 'HEC_Runtime');
var extractTo = path.join(__dirname, '..', '..');


var runtimeUrl = 'https://github.com/ucd-cws/calvin-network-tools/releases/download/'+HEC_VERSION+'/HEC_Runtime.zip';
var dataRepo = '';

var configPath = path.join(utils.getUserHome(), '.prmconf');

var done;

function getDataDir() {
  // if the data dir has already been set and dir exists, continue
  if( utils.fileExistsSync(configPath) ) {
    try {
      var config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if( config.data ) {
        if( utils.fileExistsSync(config.data) ) {
          dataRepo = config.data;
          return go();
        }
      }
    } catch(e) {
      console.log(e);
    }
  }

  console.log('\nPlease enter the full path of your data directory\n'+
                '(be sure and include /data, so will look something like /path/to/repo/calvin-network-data/data ): ');

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', function(line){
    rl.close();

    if( fs.existsSync(line) ) {
      dataRepo = line;
      go();
    } else {
      console.log('Invalid directory: '+line);
      getDataDir();
    }
  });
}


function go() {
  if( fs.existsSync(runtimeZip) ) {
    fs.unlink(runtimeZip);
  }
  rimraf(runtimeFolder, get);
}

function get() {
  console.log('');
  var spinner = new Spinner('%s Downloading runtime, this might take a minute...');
  spinner.setSpinnerString('|/-\\');
  spinner.start();

  var file = fs.createWriteStream(runtimeZip);
  var p = request
    .get(runtimeUrl)
    .pipe(file); // returns write stream pipe

  p.on('finish', function(){
    spinner.stop(true);
    console.log('Runtime download complete.');
    
    extract();
  });
}

var ranExtract = false;
function extract() {
  if( ranExtract ) {
    return;
  }
  ranExtract = true;

  process.stdout.write('Extracting runtime, please wait...');


  setTimeout(function(){
    // reading archives
    var zip = new AdmZip(runtimeZip);
    zip.extractAllTo(extractTo, true);

    process.stdout.clearLine();  // clear current text
    process.stdout.cursorTo(0);
    console.log('Runtime extraction complete.');

    write();
  }, 100);

}

function write() {
  var config = {
    data : dataRepo,
    runtime : runtimeFolder
  };

  fs.writeFileSync(path.join(utils.getUserHome(), '.prmconf'), JSON.stringify(config));
  console.log('All set.\n');
  console.log('Help:           cnf hec-prm --help');
  console.log('Example build:  cnf hec-prm build --prefix test');
  console.log('More Info:      https://github.com/ucd-cws/calvin-network-tools');

  done();
}


module.exports = function(callback) {
  done = callback;
  getDataDir();
}