module.exports = function(program, run) {
    var cmd = program
        .command('show <prmname> [prmname...]')
        .description('Print a list of nodes as they are represented in the pri files. Pass \'ALL\' to print everything..')
        .action(run);
}