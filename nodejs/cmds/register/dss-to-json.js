module.exports = function(program, run) {
    var cmd = program
        .command('dss-to-json')
        .description('Export DSS file to JSON')
        .option('-f, --file [dss file]', 'DSS file to export')
        .option('-g, --regex [expression]', 'Regex to use when selecting dss path values to write.  Default is \'*\'')
        

    require('./shared')(cmd);
    
    cmd.action(run);
}