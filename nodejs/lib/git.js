'use strict';

var exec = require('child_process').exec;

module.exports = {
    name: 'git',
    info : gitInfo,
    status : gitStatus
};

function gitStatus(cwd, callback) {
  exec('git status -s', {cwd: cwd},
    function (error, stdout, stderr) {
      var changes = (stdout || '').split('\n');
      for( var i = changes.length-1; i >= 0; i-- ) {
        if( changes[i] === ''  ) {
          changes.splice(i, 1);
        }
      }
      callback(error, changes);
    }
  );
}

function gitInfo(cwd, callback) {
    var c = 0;
    var resp = {};
    function onResp(key, text) {
        resp[key] = text;
        c++;
        if( c === 4 ) {
          callback(resp);
        }
    }

    exec('git describe --tags', {cwd: cwd},
      function (error, stdout, stderr) {
        onResp('tag', stdout.replace(/\n/,''));
      }
    );
    exec('git branch | grep \'\\*\'', {cwd: cwd},
      function (error, stdout, stderr) {
        onResp('branch', stdout ? stdout.replace(/\*/,'').replace(/\s/g,'') : '');
      }
    );
    exec('git log  -1 | sed -n 1p', {cwd: cwd},
      function (error, stdout, stderr) {
        onResp('commit', stdout ? stdout.replace(/commit\s/,'').replace(/\n/g,'') : '');
      }
    );
    exec('git config --get remote.origin.url', {cwd: cwd},
      function (error, stdout, stderr) {
        if( !stdout ) {
          onResp('origin', '');
        } else if( stdout.match(/.*git@github.com:.*/) ) {
          onResp('origin', stdout.replace(/.*github.com:/,'').replace(/.git\n$/,'').replace(/\n/g,''));
        } else {
          onResp('origin', stdout.replace(/.*github.com\//,'').replace(/.git\n$/,'').replace(/\n/g,''));
        }
      }
    );
}
