'use strict';

var HEC_VERSION = 'v1.4';

var request = require('superagent');
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
  console.log('\nDownloading runtime, this might take a minute...');

  var file = fs.createWriteStream(runtimeZip);
  var p = request
    .get(runtimeUrl)
    .pipe(file); // returns write stream pipe

  p.on('finish', function(){
    extract();
  });
}

var ranExtract = false;
function extract() {
  if( ranExtract ) {
    return;
  }
  ranExtract = true;

  console.log('Extracting runtime, please wait...');

  // reading archives
  var zip = new AdmZip(runtimeZip);
  zip.extractAllTo(extractTo, true);

  write();
}

function write() {
  var config = {
    data : dataRepo,
    runtime : runtimeFolder
  };

  fs.writeFileSync(path.join(utils.getUserHome(), '.prmconf'), JSON.stringify(config));
  console.log('All set.');
  console.log('Help: prm --help');
  console.log('Example build: prm build --prefix test');
  console.log('More Info: https://github.com/ucd-cws/calvin-network-tools');
}

getDataDir();
