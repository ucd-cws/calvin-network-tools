var hnf;

function load() {
  var dev = false;
  process.argv.forEach(function(arg){
    if( arg === '--dev' ) {
     dev = true; 
    }
  });
  
  if( dev ) {
    console.log('Using relative path hnf module'); // let the user know what's up
    hnf = require('../../hobbes-network-format');
  } else {
    hnf = require('hobbes-network-format');
  }
  
}

module.exports = function() {
  if( !hnf ) load();
  return hnf;
}