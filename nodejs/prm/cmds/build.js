'use strict';

var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var uuid = require('node-uuid');
var parse = require('csv-parse');
var stringify = require('csv-stringify');
var async = require('async');

var date = require('./date');
var crawler = require('../../crawler');
var runtime = require('../lib/runtime');
var costs = require('../../dss/cost');
var prepare = require('../lib/prepare');
var debug = require('../lib/debug');
var dummy = require('../../dss/dummy');
var updateStorage = require('../lib/updateStorage');

var options;
var args;
var callback;

module.exports = function(argv, cb) {
  console.log('Running **Build** command.\n');

  callback = cb;
  args = argv;
  options = verify(argv);

  crawler(options.data, {parseCsv : false}, onCrawlComplete);
};

function onCrawlComplete(results){
  var config = prepare.init(args);
  config.pd.path = path.join(options.output || process.cwd(), options.prefix+'PD.dss');
  config.ts.path = path.join(options.output || process.cwd(), options.prefix+'TS.dss');

  var start, stop, init, o = {};
  if( args.start && args.stop ) {
    start = date.toDate(args.start);
    stop = date.toDate(args.stop, true);
  }

  if( args['no-initialize'] ) {
    o.initialize = false;
  } else {
    o.initialize = args.initialize !== undefined ? args.initialize : 'init';
  }

  updateStorage(args.start, args.stop, results.nodes, function(){

    var nodes;
    if( args.debug ) {
      nodes = debug(args, results.nodes);
    } else {
      nodes = results.nodes;
    }

    for( var i = 0; i < nodes.length; i++ ) {
      prepare.format(nodes[i], config, o);
    }

    write(config, start, stop);
  });
}

function write(config, start, stop) {
  // add dummy pd record
  config.pd.data.push(dummy());

  var priPath = path.join(options.output || process.cwd(), options.prefix+'.pri');

  console.log('Writing PRI file: '+priPath);
  fs.writeFileSync(priPath, prepare.pri(config));

  console.log('Writing Penalty DSS file: '+config.pd.path);
  writeDssFile(config.pd, function(err, resp){

    if( start && stop ) {
      trimTsData(start, stop, config.ts, function(ts, tmpDir){
        writeTsDssFile(config.ts, function(){
          if( args.keep ) {
            console.log('Done. Keeping tmp.');
            callback();
          } else {
            cleanTmpDir(tmpDir, function(){
              console.log('Done.');
              callback();
            });
          }
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
          date.trim(start, stop, data);

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

function writeTsDssFile(tsConfig, callback) {
  console.log('Writing TimeSeries DSS file: '+tsConfig.path);
  writeDssFile(tsConfig, function(err, resp){
    if( callback ) {
      callback();
    } else {
      console.log('Done.');
    }
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

  runtime(args.runtime, dss, args, callback);
}

function verify(argv) {
  var options = {
    prefix : '',
    runtime : '',
    data : ''
  };

  if( argv.prefix ) {
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
