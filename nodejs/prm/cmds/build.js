'use strict';

var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var uuid = require('node-uuid');
var parse = require('csv-parse');
var stringify = require('csv-stringify');
var async = require('async');

var crawler = require('../../crawler');
var runtime = require('../lib/runtime');
var costs = require('../../dss/cost');
var prepare = require('../lib/prepare');

var options;
var args;

module.exports = function(argv) {
  args = argv;
  options = verify(argv);

  crawler(options.data, {parseCsv : false}, onCrawlComplete);
};

function onCrawlComplete(results){
  var config = prepare.init();
  config.pd.path = path.join(options.output || process.cwd(), options.prefix+'PD.dss');
  config.ts.path = path.join(options.output || process.cwd(), options.prefix+'TS.dss');


  var start, stop;
  if( args.start && args.stop ) {
    start = toDate(args.start);
    stop = toDate(args.stop);
  }

  async.eachSeries(
    results.nodes,
    function(node, next){
      // update initial and ending storage if start and stop provided
      if( node.properties.type === 'Surface Storage' && node.properties.storage && start && stop) {

        parse(fs.readFileSync(node.properties.storage, 'utf-8'), {comment: '#', delimiter: ','}, function(err, data){
          trimDates(data, start, stop);

          if( data.length > 1 ){
            node.properties.initialstorage = parseFloat(data[1][1]);
            node.properties.endingstorage = parseFloat(data[data.length-1][1]);
          }

          prepare.format(node, config);
          next();
        });
      } else {
        prepare.format(node, config);
        next();
      }
    },
    function(err) {
      write(config, start, stop);
    }
  );
}

function write(config, start, stop) {
  var priPath = path.join(options.output || process.cwd(), options.prefix+'.pri');

  console.log('Writing PRI file: '+priPath);
  fs.writeFileSync(priPath, prepare.pri(config));

  console.log('Writing Penalty DSS file: '+config.pd.path);

  writeDssFile(config.pd, function(err, resp){

    if( start && stop ) {
      trimTsData(start, stop, config.ts, function(ts, tmpDir){
        writeTsDssFile(config.ts, function(){
          cleanTmpDir(tmpDir, function(){
            console.log('Done.');
          });
        });
      });
    } else {
      writeTsDssFile(config.ts);
    }

  });
}


function trimTsData(start, stop, ts, callback) {
  console.log('Trimming ts data: '+start.toLocaleDateString()+' to '+stop.toLocaleDateString());

  var dir = path.join(process.cwd(), 'tmp');
  cleanTmpDir(dir, function(){
    fs.mkdirSync(dir);

    async.eachSeries(
      ts.data,
      function(node, next) {

        parse(fs.readFileSync(node.csvFilePath, 'utf-8'), {comment: '#', delimiter: ','}, function(err, data){
          trimDates(start, stop, data);

          var uid = uuid.v1();
          var newFilePath = path.join(dir, uid+'.csv');
          node.csvFilePath = newFilePath;

          stringify(data, function(err, csvstring){
            if( err ) {
              console.log(err);
            } else {
              fs.writeFileSync(newFilePath, csvstring);
            }
            next();
          });

        });
      },
      function() {
        callback(ts, dir);
      }
    );
  });
}

function trimDates(start, stop, data) {
  var i, date;
  for( i = data.length-1; i >= 1; i-- ) {
    date = toDate(data[i][0]).getTime();
    if( start.getTime() > date || stop.getTime() < date ) {
      data.splice(i, 1);
    }
  }
}

function toDate(dateStr) {
  var parts = dateStr.split('-');
  return new Date(parseInt(parts[0]), parseInt(parts[1])-1, parts.length > 2 ? parseInt(parts[2]) : 1);
}

function writeTsDssFile(tsConfig, callback) {
  console.log('Writing TimeSeries DSS file: '+tsConfig.path);
  writeDssFile(tsConfig, function(err, resp){
    if( callback ) callback();
    else console.log('Done.');
  });
}

function cleanTmpDir(dir, callback) {
  if( fs.existsSync(dir) ) {
    rimraf(dir, callback);
  } else {
    callback();
  }
}

function writeDssFile(dss, callback) {
  var options = {};
  if( args.debugRuntime ) {
    args.keep = true;
  }
  if( args.verbose ) {
    args.verbose = true;
  }

  runtime(args.runtime, dss, args, function(err, resp){
    if( err ) {
      console.log('ERROR: writing to dss file.');
      console.log(err);
      //return;
    }

    if( args.verbose ) {
      console.log(resp.stack);
    }

    callback();
  });
}

function verify(argv) {
  var options = {
    prefix : '',
    runtime : '',
    data : ''
  };

  if( argv._.length > 0 ) {
    options.prefix = argv._[0];
  } else if( argv.prefix ) {
    options.prefix = argv.prefix;
  }

  if( argv.r ) {
    options.runtime = argv.r;
  } else if( argv.runtime ) {
    options.runtime = argv.runtime;
  }

  if( argv.d ) {
    options.data = argv.d;
  } else if( argv.data ) {
    options.data = argv.data;
  }

  if( argv.output ) {
    options.output = argv.output;
  }

  for( var key in options ) {
    if( !options[key] ) {
      console.log('Missing '+key);
      process.exit(-1);
    }
  }

  if( !fs.existsSync(options.runtime) ) {
    console.log('Invalid runtime path: '+options.runtime);
    process.exit(-1);
  } else if( !fs.existsSync(options.data) ) {
    console.log('Invalid data repo path: '+options.data);
    process.exit(-1);
  }

  return options;
}

function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}
