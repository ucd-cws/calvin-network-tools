/**
 * TMP
 * 
 * We may change this.  Currently timeseries is dictated by flow.  No flow, no steps.
 * If flow is not provided, we are going to fake the timeseries steps, for now.
 *
 * NS: This bit of code appears to generate flows for items that don't have it specified, which tends to mean for many
 * sinks in the current iteration of the code. Items with explicit timeseries defined won't use it, so bugs that crop
 * up here only impact a subset of the network.
 *
 * Note that we have a module global "steps" object - it's only ever run once and then it's reused for all items that need
 * it.
 */
var config = require('../../config').get() || {};
var daysInMonth = require('../../lib/utils').daysInMonth;

var DEFAULT_START = Date.UTC(1921, 9);
var DEFAULT_STOP = Date.UTC(2003, 9);  // 9 corresponds to October in this constructor
var steps;

function createSteps() {
  // there may be a way to simplify this function's UTC time calculations, but this built on existing code and for now
  // they work in both eastern and western hemisphere (unlike before).

  var steps = [['date','kaf']];

  // if we don't use UTC dates, then we get weird time zone issues when we start advancing through dates because of the
  // way javascript interprets date inputs - creating UTC dates is a bit weird
  var start_date = config.start ? config.start : DEFAULT_START;
  var stop_date = config.stop ? config.stop : DEFAULT_STOP;

  // parse the start date to get the last day of the month for the first iteration
  var start_date_reparse = new Date(start_date);
  var start = new Date(Date.UTC(start_date_reparse.getFullYear(), start_date_reparse.getMonth(), daysInMonth(start_date_reparse.getMonth()+1, start_date_reparse.getFullYear())));
  var stop = new Date(stop_date);

  // build the actual timesteps
  var currentDate = start;
  while( currentDate.getTime() < stop.getTime() ) {
    steps.push([currentDate.toISOString().replace(/T.*/,''), '']);

    // advance the date - the indexing here is weird. currentDate.getMonth seems to drop the index by an extra value for UTC dates - not sure what's happening - not typical 0-based indexing.
    currentDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth()+1, daysInMonth(currentDate.getMonth()+2, currentDate.getFullYear())));
  }
  return steps;
}

module.exports = function() {
  if( !steps ) {
    steps = createSteps();
  }
  return steps;
};