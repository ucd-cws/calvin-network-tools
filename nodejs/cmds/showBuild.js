'use strict';

var crawler = require('hobbes-network-format');
var parse = require('csv-parse');
var fs = require('fs');

var pri = require('../pri');
var debug = require('../lib/debug');
var async = require('async');
var utils = require('../lib/utils');
var config = require('../config').get();
var checkRequired = require('../lib/checkRequired');

var required = ['data'];

module.exports = function(type, callback) {

  checkRequired(required);

  if( !config.nodes && !config.debug ) {
    console.log('You need to supply a prmname to show');
    if( callback ) callback();
    return;
  }
  if( config.nodes.length === 0 ) {
    console.log('You need to supply a prmname to show');
    if( callback ) callback();
    return;
  }

  var prmname = config.nodes.splice(0,1)[0];
  var data = config.data;

  var o = {};
  if( config.noInitialize ) {
    o.initialize = false;
  } else {
    o.initialize = config.initialize !== undefined ? config.initialize : 'init';
  }

  var pridata = pri.init();
  crawler(data, {parseCsvData : false}, function(results){

    var nodes, all = false;
    if( config.debug ) {
      all = true;
      nodes = debug(results.nodes.features);
    } else {
      nodes = results.nodes.features;
    }

    for( var i = 0; i < nodes.length; i++ ) {
      if( all || nodes[i].properties.prmname.toUpperCase() === prmname.toUpperCase() ) {
        pri.format(nodes[i], pridata, o);
        print(pridata);
        if( !config.debug ) {
          if( callback ) callback();
          return;
        }
      }
    }

    if( !config.debug ) {
      console.log('prmname '+prmname+' not found.');
    }
    
    if( callback ) callback();
  });
};

function print(pridata) {
  console.log('*** Time Series ***');
  var csvFiles = [], i;
  for( i = 0; i < config.ts.data.length; i++ ) {
    console.log(config.ts.data[i]);
    csvFiles.push(config.ts.data[i].csvFilePath);
  }
  console.log('*** Penalty ***');
  for( i = 0; i < pridata.pd.data.length; i++ ) {
    console.log(config.pd.data[i]);
    csvFiles.push(config.pd.data[i].csvFilePath);
  }

  if( !config.showData ) {
    return;
  }

  var start, stop;
  if( config.start && config.stop ) {
    start = utils.toDate(config.start);
    stop = utils.toDate(config.stop, true);
  }

  async.eachSeries(
    csvFiles,
    function(file, next) {
      if( !fs.existsSync(file) ) {
        console.log('Unabled to find: '+file);
        return next();
      }

      parse(fs.readFileSync(file, 'utf-8'), {comment: '#', delimiter: ','}, function(err, data){
        if( start && stop ) {
          utils.trimDates(start, stop, data);
        }

        console.log(data);
        next();
      });
    },
    function() {
      // done
    }
  );
}
