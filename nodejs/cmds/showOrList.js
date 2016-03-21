'use strict';

var crawler = require('hobbes-network-format');

var updateStorage = require('../lib/updateStorage');
var pri = require('../pri');
var debug = require('../lib/debug');
var link = require('../pri/format/link');
var path = require('path');
var config = require('../config').get();

var callback;

module.exports = function(cb) {
  if( config.verbose ) {
    console.log('Running **'+config.nodeCmdType+'** command.\n');
  }

  callback = cb;


  if( !config.nodes && !config.debug ) {
    console.log('Please provide a nodes to '+config.nodeCmdType);
    return callback();
  }

  if( !config.data ) {
    console.log('Please provide a data repo location');
    return callback();
  }

  if( config.nodeCmdType === 'show' ) {
    show();
  } else if( config.nodeCmdType === 'list' ) {
    list();
  }
};

function list() {
  var nodes = config.nodes;
  var datapath = config.data;

  for (var i = 0 ; i < nodes.length; i++) {
    nodes[i] = nodes[i].toUpperCase();
  }

  crawler(datapath, {parseCsvData : false}, function(results){
    var i, node;

    for( i = 0; i < results.nodes.features.length; i++ ) {
      node = results.nodes.features[i];
      if( nodes[0] === '' || nodes[0] === 'ALL' || nodes.indexOf(node.properties.prmname.toUpperCase()) > -1 ) {
        console.log(node.properties.prmname+','+path.join(node.properties.hobbes.repo.path, node.properties.hobbes.repo.filename));
      }
    }

    callback();
  });
}

function show() {
  var nodes = config.nodes;
  var datapath = config.datapath;

  var o = {};
  if( config['no-initialize'] ) {
    o.initialize = false;
  } else {
    o.initialize = config.initialize !== undefined ? config.initialize : 'init';
  }

  for (var i = 0 ; i < nodes.length; i++) {
    nodes[i] = nodes[i].toUpperCase();
  }

  var pridata = pri.init();

  crawler(config.data, {parseCsvData : false}, function(results){
    var node, i;
    var list = [];

    if( config.debug ) {
      list = debug(results.nodes.features);
    } else {
      for( i = 0; i < results.nodes.features.length; i++ ) {
        node = results.nodes.features[i];
        if( nodes[0] === '' || nodes[0].toUpperCase() === 'ALL' || nodes.indexOf(node.properties.prmname.toUpperCase()) > -1 ) {
          list.push(node);
        }
      }
    }

    updateStorage(config.start, config.stop, list, function(){
      for( var i = 0; i < list.length; i++ ) {
        pri.format(list[i], pridata, o);
      }

      console.log(pri.create(pridata.pri, config, false));
      callback();
    });
  });
}
