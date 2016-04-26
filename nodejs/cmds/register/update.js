module.exports = function(program, run) {
    var cmd = program
        .command('update')
        .description('Apply results from dss file back to data repo')
        .option('-g, --regex', 'Regex to use when selecting dss path values to write back to repo.')
        .option('-L  --clean-cache', 'Clears local update cache')
        .option('-l  --cache', 'Cache data read from dss file in local json file');
        
    require('./shared')(cmd);
    
    cmd.action(run);
}

