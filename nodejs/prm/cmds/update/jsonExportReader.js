'use strict';

var path = require('path');

module.exports = function(dir) {
  var index = require(dir);

  this.getNodes = function() {
    return Object.keys(index);
  };

  this.getParams = function(prmname) {
    if( index[prmname] ) {
      return Object.keys(index[prmname]);
    }
    return [];
  };

  this.hasParam = function(prmname, param) {
    if( !index[prmname] ) {
      return false;
    }
    if( !index[prmname][param] ) {
      return false;
    }
    return true;
  };

  this.get = function(prmname, param) {
    if( !index[prmname] ) {
      return null;
    }
    if( !index[prmname][param] ) {
      return null;
    }
    if( typeof index[prmname][param] === 'number' ) {
      index[prmname][param] = require(path.join(dir, index[prmname][param]+''));
    }

    return index[prmname][param];
  };

  this.getDataArray = function(prmname, param) {
    var data = this.get(prmname, param);
    if( !data ) {
      return data;
    }

    var arr = [['date',data.timeSeriesContainer.parameter]], date, m, d;
    for( var i = 0; i < data.dates.length; i++ ) {
      // HACK
      // Currently crazy DSS date math as this one day past actual date.
      // Reading into JavaScript reads it as Zulu.  Running script in US
      // it will result in d.getDate() reading in local time, one day earlier...
      // not dealing with JS date crappyness for now.  If you run this in Europe or
      // asia, I appologies.  Feel free to fix.
      date = new Date(data.dates[i].replace(/T.*/,''));
      m = date.getMonth()+1;
      d = date.getDate();
      if( m < 10 ) m = '0'+m;
      if( d < 10 ) d = '0'+d;
      arr.push([date.getFullYear()+'-'+m+'-'+d, data.timeSeriesContainer.values[i]]);
    }
    return arr;
  };

};
