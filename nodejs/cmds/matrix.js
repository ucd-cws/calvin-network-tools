// matrix prints out the required matrix inputs for any given set of nodes
// or links
// The matrix is i,j,k,c,a,l,u
// where i = origin
// j= terminal
// k = link number
// c = cost
// a =amplitude
// l = lower bound
// u = upper bound

'use strict';

var matrix = require('../matrix');
var config = require('../config').get();
var fs = require('fs');
var graphviz = require('graphviz');
var path = require('path');

module.exports = function (callback) {
  var cmd_opts;
  var matrix_output=[];
  var matrix_data=[];
  var nodes_output=[];
  var node_list = {};
  
  config.fs = config.fs || ',';
  if (config.fs === ':tab:') {
    config.fs = '\t';
  }
  
  config.format = config.format || 'csv';
  config.ts = config.ts || '@';
  config.rs = config.rs || '\n';
  config.to = config.to || 'STDOUT';
  
  if( config.outboundPenalty ) {
    config.outboundPenalty = JSON.parse(config.outboundPenalty);
  }
  
  if (config.verbose) {
    console.log('Running matrix command.\n');
  }

  if (!config.nodes && !config.debug) {
    console.log('Please provide a nodes to ' + config.nodeCmdType);
    return callback();
  }

  if (!config.data) {
    console.log('Please provide a data repo location');
    return callback();
  }

  matrix(config, function (rows) {
    
    var header = ["i", "j", "k", "cost", "amplitude", "lower_bound", "upper_bound"];
    if (!config['no-header']) {
      matrix_output.push(header.join(config.fs));
      nodes_output.push("node");
     }

    rows.forEach(function (r) {
      node_list[r[0]]=true;
      node_list[r[1]]=true;
      if (config.maxUb) {
        if (r[6] === null) {
          r[6] = config.maxUb;
        }
      }
      var line = r.join(config.fs);
      matrix_output.push(line);
      matrix_data.push(r);
    });
    
    if( config.outnodes ) {
      nodes_output=Object.keys(node_list).sort();
      if (config.nodes === "STDOUT") {
        console.log(nodes_output.join(config.rs) + config.rs);
      } else {
        fs.writeFile(config.outnodes, 
          nodes_output.join(config.rs)+config.rs,'utf8',
         (err) => { if (err) {throw err;}});
      }
    }

    if( config.format === 'png' ) {
      toPng(matrix_data);
    } else {
      var output;
      if( config.format === 'dot' ) {
        output = toDot(matrix_data);
      } else {
        output = matrix_output.join(config.rs)+config.rs;
      }
      
      if( config.to === 'STDOUT' ) {
        console.log(output);
      } else {
        fs.writeFileSync(
          path.join(process.cwd(), `${config.output}.${config.format}`),
          output
        );
      }
    }

    
    callback();
  });
  // TODO: Should I catch errors here?
};

function toPng(matrix) {
  var g = createGraph(matrix);
  g.output('png', path.join(process.cwd(), `${config.output}.png`));
}

function toDot(matrix) {
  var g = createGraph(matrix);
  return g.to_dot(); 
}

function createGraph(matrix) {
  var nodes = {};
  var g = graphviz.digraph('G');
  
  matrix.forEach((link) => {
    if( !nodes[link[0]] ) {
      nodes[link[0]] = g.addNode(link[0], {});
    }
    if( !nodes[link[1]] ) {
      nodes[link[1]] = g.addNode(link[1], {});
    }
    
    var origin = nodes[link[0]];
    var terminal = nodes[link[1]];
    
    g.addEdge(origin, terminal, {label: link[2]+':'+link[3]});
  });
  
  return g;
}