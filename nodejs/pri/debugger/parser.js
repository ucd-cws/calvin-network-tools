
var valid = false;
var current = {};

module.exports = function(line) {
  if( line.match(/^\.\./) ) {
    if( valid ) {
      valid = false;
      return current;
    }
    return null;
  }

  if( line.match(/^LINK/i) ) {
    valid = true;
    parseLink(line);
  } else if( line.match(/^NODE/i) ) {
    valid = true;
    parseNode(line);
  }

  if( !valid ) return null;

  if( line.match(/^LD/) ) parseDescription(line);
}

function parseLink(line) {
  current = {
    is : 'LINK',
    type : line.substr(10, 10).trim(),
    origin : line.substr(20, 10).trim().toLowerCase(),
    terminus : line.substr(30, 10).trim().toLowerCase(),
    amplitude : line.substr(40, 10).trim(),
    cost : line.substr(50, 10).trim(),
    lowerBound : line.substr(60, 10).trim(),
    upperBound : line.substr(70, 10).trim(),
    constantBound : line.substr(80, 10).trim()
  };
  current.id = current.origin+'-'+current.terminus;
}
// LINK      
// DIVR      
// DIVR      SR_SCC   

function parseNode(line) {
  current = {
    is : 'NODE',
    type : 'NODE',
    id : line.substr(10, 10).trim().toLowerCase(),
    initialStorage : line.substr(20, 10).trim(),
    areaCapfactor : line.substr(30, 10).trim(),
    endingStorage : line.substr(40, 10).trim()
  };
}

function parseDescription(line) {
  current.description = line.substr(10, line.length-10).trim();
}