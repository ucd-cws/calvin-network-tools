var fs = require('fs');
var path = require('path');

var root = 'testTS_JSON';

fs.readdir(root, (err, files) => {
  files.forEach(check);
});

function check(file) {
  if( file === '.' || file === '..' || file === 'index.json' ) {
    return;
  }

  var data = fs.readFileSync('./'+path.join(root, file), 'utf-8');
  data = JSON.parse(data);

  var i, v;
  for( i = 0; i < data.timeSeriesContainer.values.length; i++ ) {
    v = data.timeSeriesContainer.values[i];

    if( typeof v !== 'number' || isNaN(v) ) {
      console.log('BAD!!! '+v);
    } else {
      console.log(v);
    }
  }

}