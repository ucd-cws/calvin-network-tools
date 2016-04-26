module.exports = function(program, run) {
    var cmd = program
        .command('list <prmname> [prmname...]')
        .description('Print all nodes/link. Pass \'ALL\' to print everything.')
        .action(run);
}