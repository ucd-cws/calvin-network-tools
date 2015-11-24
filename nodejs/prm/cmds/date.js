'use strict';

var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function trimDates(start, stop, data) {
  var i, date;
  for( i = data.length-1; i >= 1; i-- ) {
    date = toDate(data[i][0]).getTime();
    if( start.getTime() > date || stop.getTime() < date ) {
      data.splice(i, 1);
    }
  }
}

function toDate(dateStr, isStop) {
  var parts = dateStr.split('-');

  var day = parts.length > 2 ? parseInt(parts[2]) : 1;
  if( isStop && parts.length <= 2) {
    day = daysInMonth[parseInt(parts[1])-1];
  }

  return new Date(
    parseInt(parts[0]),
    parseInt(parts[1])-1,
    day
  );
}

module.exports = {
  trim : trimDates,
  toDate : toDate
};
