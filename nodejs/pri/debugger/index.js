const readline = require('readline');
const fs = require('fs');
const parser = require('./parser');

var pri1 = {}, pri2 = {}, result;

var nodeProps = ['initialStorage', 'areaCapfactor', 'endingStorage'];
var linkProps = ['amplitude', 'cost', 'lowerBound', 'upperBound', 'constantBound'];

console.log(`Reading: ${process.argv[2]}`);

var rl = readline.createInterface({
  input: fs.createReadStream(process.argv[2])
});
rl.on('line', function (line) {
  result = parser(line);
  if( result ) pri1[result.id] = result;
});
rl.on('close', readFile2);

function readFile2() {
  parser('..');
  console.log(`Reading: ${process.argv[3]}`);
  rl = readline.createInterface({
    input: fs.createReadStream(process.argv[3])
  });
  rl.on('line', function (line) {
    result = parser(line);
    if( result ) pri2[result.id] = result;
  });
  rl.on('close', compare);
}

function compare() {
  var notIn1 = [];
  var notIn2 = [];

  var checklist = [];
  for( var key in pri1 ) {
    if( !pri2[key] ) notIn2.push(key);
    else checklist.push(key);
  }
  for( var key in pri2 ) {
    if( !pri1[key] ) notIn1.push(key); 
    else if( checklist.indexOf(key) === -1 ) checklist.push(key);
  }

  console.log(`In ${process.argv[2]} but not in ${process.argv[3]}: `);
  console.log(notIn1);
  console.log();

  console.log(`In ${process.argv[3]} but not in ${process.argv[2]}: `);
  console.log(notIn2);
  console.log();

  checklist.forEach((key) => {
    compareNode(pri1[key], pri2[key]);
  });
  console.log(c);
}

var c = 0;
function compareNode(n1, n2) {
  var props;
  if( n1.is === 'NODE' ) {
    props = nodeProps;
  } else {
    props = linkProps;
  }

  var diff = [];
  props.forEach((prop) => {
    var v1 = getValue(n1[prop]);
    var v2 = getValue(n2[prop]);
    if( v1 != v2 ) {
      diff.push(`${prop}: ${v1}|${v2}`);
    }
  });

  if( diff.length > 0 ) {
    c++;
    console.log(`======== ${n1.id} ========`);
    console.log('  '+diff.join('\n  '));
    console.log();
  }
}

function getValue(v) {
  if( v === null || v === undefined ) return v;
  v = parseFloat(v);
  if( isNaN(v) ) return '';

  //return v;
  if( v === null || v === undefined ) return v;
  return parseFloat(v.toFixed(1));
}