/**
 * TMP
 * 
 * We may change this.  Currently timeseries is dictated by flow.  No flow, no steps.
 * If flow is not provided, we are going to fake the timeseries steps, for now.
 */
var config = require('../config').get() || {};
var daysInMonth = require('../lib/utils').daysInMonth;

var DEFAULT_START = '1921-10-01';
var DEFAULT_STOP = '2003-10-01';
var steps;

function createSteps() {
  var steps = [['date','kaf']];

  var start = new Date(config.start ? config.start+'-01' : DEFAULT_START);
  var stop = new Date(config.stop ? config.stop+'-01' : DEFAULT_STOP);

  var currentDate = new Date(start.getTime());
  while( currentDate.getTime() < stop.getTime() ) {
    steps.push([currentDate.toISOString().replace(/T.*/,''), '']);
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 1);
    currentDate.setDate(daysInMonth[currentDate.getMonth()]);
  }

  return steps;
}

module.exports = function() {
  if( !steps ) {
    steps = createSteps();
  }
  return steps;
};