module.exports = function(program, run) {
    var cmd = program
        .command('build')
        .description('Write CSV data files to ts and pd dss file. Requires the Calvin HEC Runtime')
        .option('-s, --start [YYYY-MM]', 'Specify start date for TimeSeries data')
        .option('-t, --stop [YYYY-MM]', 'Specify stop date for TimeSeries data')
        .option('-d, --debug [nodes]', 'Set debug nodes.  Either "ALL", "*" or comma seperated list of prmnames (no spaces)')
        .option('-D, --debug-cost', 'set cost for debug nodes (default: 2000000)')
        .option('-R, --debug-runtime', 'Keeps the PRM NodeJS json file used to pass information to the dssWriter (Calvin HEC Runtime) jar');

    require('./shared')(cmd);
    
    cmd.action(run);
}