'use strict';

var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var uuid = require('node-uuid');
var parse = require('csv-parse');
var stringify = require('csv-stringify');
var async = require('async');
var hnf = require('../hnf')();
var crawler = hnf.crawl;

var config = require('../config').get();
var utils = require('../lib/utils');
var runtime = require('../lib/runtime');
var costs = require('../dss/cost');
var pri = require('../pri');
var debug = require('../lib/debug');
var dummy = require('../dss/dummy');
var updateStorage = require('../lib/updateStorage');
var checkRequired = require('../lib/checkRequired');

var callback;
var required = ['data', 'runtime', 'prefix'];

// var ignoreList = ['HXI201-EXT_YUBA', 'HXI101-EXT_REDDIN'];

module.exports = function(cb) {
  if( config.verbose ) {
    console.log('Running **Build** command.\n');
  }

  checkRequired(required);
  callback = cb;

  crawler(config.data, {parseCsvData : false}, onCrawlComplete);
};

function onCrawlComplete(results){
  var pridata = pri.init();

  var root = utils.getWorkspacePath();

  // for( var i = results.nodes.features.length-1; i >= 0; i-- ) {
  //   if( ignoreList.indexOf(results.nodes.features[i].properties.prmname.toUpperCase()) > -1 ) {
  //     results.nodes.features.splice(i, 1);
  //   }
  // }

  if( !fs.existsSync(root) ) {
    fs.mkdirSync(root);
  }

  pridata.pd.path = path.join(root, config.prefix+'PD.dss');
  pridata.ts.path = path.join(root, config.prefix+'TS.dss');

  var start, stop, init, o = {};
  if( config.start && config.stop ) {
    start = utils.toDate(config.start);
    stop = utils.toDate(config.stop, true);
  }

  if( config.noInitialize ) {
    o.initialize = false;
  } else {
    o.initialize = (typeof config.initialize === 'string') ? config.initialize : 'init';
  }

  readUBMandLBM(results.nodes.features, function() {
    updateStorage(config.start, config.stop, results.nodes.features, function(){
      var nodes;

      if( config.debug ) {
        nodes = debug(results.nodes.features);
      } else {
        nodes = results.nodes.features;
      }

      for( var i = 0; i < nodes.length; i++ ) {
        pri.format(nodes[i], pridata, o);
      }

      write(pridata, start, stop);
    });
  });
}

function readUBMandLBM(nodes, callback) {
  var array = [], bounds, bound;

  for( var i = 0; i < nodes.length; i++ ) {
    bounds = nodes[i].properties.bounds;
    if( bounds ) {
      for( var j = 0; j < bounds.length; j++ ) {
        bound = bounds[j];
        if( bound.type === 'UBM' || bound.type === 'LBM' ) {
          array.push(bound);
        }
      }
    }
  }

  async.eachSeries(
    array,
    function(bound, next) {
      hnf.readFile(bound, 'bound', next);
    },
    callback
  );
}

function write(pridata, start, stop) {
  // add dummy pd record
  pridata.pd.data.push(dummy());

  var priPath = path.join(utils.getWorkspacePath(), config.prefix+'.pri');

  console.log('Writing PRI file: '+priPath);
  fs.writeFileSync(priPath, pri.create(pridata.pri));

  console.log('Writing Penalty DSS file: '+pridata.pd.path);
  if( fs.existsSync(pridata.pd.path) ) {
    fs.unlinkSync(pridata.pd.path);
  }

  writeDssFile(pridata.pd, function(err, resp){

    if( start && stop ) {
      trimTsData(start, stop, pridata.ts, function(ts, tmpDir){
        writeTsDssFile(pridata.ts, function(){
          if( config.debugRuntime ) {
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
      writeTsDssFile(pridata.ts);
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
          utils.trimDates(start, stop, data);

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

  if( fs.existsSync(tsConfig.path) ) {
    fs.unlinkSync(tsConfig.path);
  }

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
  runtime(dss, callback);
}
