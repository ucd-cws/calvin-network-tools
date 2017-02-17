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
  
  // set the file separator for the CSV file
  config.fs = config.fs || ',';

  // set the format type
  config.format = config.format || 'csv';
  config.format = config.format.toLowerCase();

  // if tab separator, convert to tab charactor
  if (config.fs === ':tab:' || config.format === 'tsv' ) {
    config.fs = '\t';
  }

  // set time separator.  this goes between node id and time for columns i and j.
  config.ts = config.ts || '@';
  // set newline separator.  Not sure why called rs...
  config.rs = config.rs || '\n';
  // where to direct output to
  config.to = config.to || 'STDOUT';
  
  // read in outboundPenalty
  if( config.outboundPenalty ) {
    config.outboundPenalty = JSON.parse(config.outboundPenalty);
  }
  
  if (config.verbose) {
    console.log('Running matrix command.\n');
  }

  // if (!config.nodes && !config.debug) {
  //   console.log('Please provide a nodes to ' + config.nodeCmdType);
  //   return callback();
  // }

  if (!config.data) {
    console.log('Please provide a data repo location');
    return callback();
  }

  if( config.regions ) {
    config.regions = config.regions.replace(/\s/g,'').split(',');
    if( !config.nodes ) config.nodes = [];
    config.regions.forEach(region => config.nodes.push(region));
  }


  // run matrix module
  matrix(config, function (rows) {
    
    // we are now ready to create matrix
    var header = ['i', 'j', 'k', 'cost', 'amplitude', 'lower_bound', 'upper_bound'];

    if( !config['no-header'] ) {
      matrix_output.push(header.join(config.fs));
      nodes_output.push('node');
    }

    rows.forEach((r) => {
      node_list[r[0]] = true;
      node_list[r[1]] = true;

      if( config.maxUb ) {
        if( r[6] === null ) {
          r[6] = config.maxUb;
        }
      }

      var line = r.join(config.fs);
      matrix_output.push(line);
      matrix_data.push(r);
    });
    
    if( config['dump-nodes'] ) {
      nodes_output = Object.keys(node_list).sort();

      if( config['dump-nodes'] === 'STDOUT' ) {
        console.log(nodes_output.join(config.rs) + config.rs);
      } else {
        fs.writeFile(
          config['dump-nodes'], 
          nodes_output.join(config.rs)+config.rs,
          'utf8',
           (err) => { 
             if (err) throw err;
           }
        );
      }
    }

    if( config.format === 'png' ) {
      toPng(matrix_data);
    } else {
      var output;
      if( config.format === 'dot' ) {
        output = toDot(matrix_data);

        if( config.to === 'STDOUT' ) {
          console.log(output);
        } else {
          fs.writeFileSync(
            path.join(process.cwd(), `${config.to}.${config.format}`),
            output
          );
        }

      // This needs to be able to handle large outputs
      } else {
        if( config.to === 'STDOUT' ) {
          matrix_output.forEach((row) => {
            console.log(row+config.rs);
          });
        } else {
          var file = fs.createWriteStream(`${config.to}.${config.format}`);
          matrix_output.forEach(function(row) { 
            file.write(row+config.rs); 
          });
          file.end();
        }
      }
    } 

    console.log('Matrix export complete.');
    
    callback();
  });
  // TODO: Should I catch errors here?
};

function toPng(matrix) {
  var g = createGraph(matrix);
  console.log(path.join(process.cwd(), `${config.to}.png`));
  g.output('png', path.join(process.cwd(), `${config.to}.png`));
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