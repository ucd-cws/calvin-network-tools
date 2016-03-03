'use strict';

var async = require('async');
var fs = require('fs');
var readRefs = require('./readRefs');
var path = require('path');

function readNodes(dir, nodes, gitInfo, parseCsvData, callback) {
  var files = fs.readdirSync(dir);

  var re = new RegExp('.*'+gitInfo.origin.split('/')[1]);

  async.eachSeries(files,
    function(file, next){

      // the setImmediate call is so you don't get overflow errors with older versions of NodeJs.
      // ignore . files
      if( file.match(/^\./) ) {
        return setImmediate(next);
      }
      // ignore region files
      if( file === 'region.geojson' ) {
        return setImmediate(next);
      }

      var stat = fs.statSync(path.join(dir, file));

      // if child file is a dir recurse in
      if( stat.isDirectory() ) {
        return readNodes(path.join(dir, file), nodes, gitInfo, parseCsvData, next);

      // if this is a geojson file, let's do some stuff
      } else if ( stat.isFile() && file.match('\.geojson$') ) {

        // clean and read node/link
        var d = fs.readFileSync(path.join(dir, file), 'utf-8').replace(/[\r\n]/g,'');
        d = JSON.parse(d);

        // check prmname
        if( !d.properties ) {
          d.properties = {};
        }
        if( !d.properties.prmname ) {
          console.log('  --Invalid PRMNAME: '+file+' has no prmname');
        } else if( !d.properties.prmname.length > 10  ) {
          console.log('  --Invalid PRMNAME: '+file+' has no prmname greater than 10 character: '+d.properties.prmname);
        }

        // ignore feature collections for now
        if( d.type === 'FeatureCollection' ) {
          if( global.debug ) {
            console.log('  --Ignoring: '+file+' FeatureCollection\'s are not currently supported');
          }
          return next();
        }

        // set repo information for the node
        d.properties.repo = {
          dir : dir,
          dirNodeName : dir.replace(/.*(\/|\\)/,''),
          filename : file
        };

        // see if we have a readme file
        if( fs.existsSync(dir+'/README.md') ) {
          d.properties.readme = fs.readFileSync(dir+'/README.md', 'utf-8');
        }

        // now we need to read all file reference points;
        readRefs(d.properties.repo.dir, d.properties.filename, d, 'properties', parseCsvData, function(){

          d.properties.repo.dir = dir.replace(re, '');
          nodes.push(d);
          setImmediate(next);

        });
        return;
      }

      setImmediate(next);
    },
    function(err){
      if( err && global.debug ) {
        console.log(err);
      }
      callback();
    }
  );
}

module.exports = readNodes;
