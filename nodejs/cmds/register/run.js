module.exports = function(program, run) {
    var cmd = program
        .command('run')
        .description('Run the hecprm.exe program with provided prefix files. Wine is required (non-windoz).')
        
    require('./shared')(cmd);
    
    cmd.action(run);
}