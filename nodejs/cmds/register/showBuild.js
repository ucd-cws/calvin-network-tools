module.exports = function(program, run) {
    var cmd = program
        .command('show-build')
        .description('Print the JSON that will be passed to the DssWrite')
        .option('-s, --start [YYYY-MM]', 'Specify start date for TimeSeries data')
        .option('-t, --stop [YYYY-MM]', 'Specify stop date for TimeSeries data')
        .option('-d, --debug', 'Set debug nodes.  Either "ALL", "*" or comma seperated list of prmnames (no spaces)')
        .option('-S, --show-data', 'Print the csv file data as well')
        
    require('./shared')(cmd);
    
    cmd.action(run);
}