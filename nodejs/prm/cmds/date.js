'use strict';

function trimDates(start, stop, data) {
  var i, date;
  for( i = data.length-1; i >= 1; i-- ) {
    date = toDate(data[i][0]).getTime();
    if( start.getTime() > date || stop.getTime() < date ) {
      data.splice(i, 1);
    }
  }
}

function toDate(dateStr) {
  var parts = dateStr.split('-');
  return new Date(parseInt(parts[0]), parseInt(parts[1])-1, parts.length > 2 ? parseInt(parts[2]) : 1);
}

module.exports = {
  trim : trimDates,
  toDate : toDate
};
