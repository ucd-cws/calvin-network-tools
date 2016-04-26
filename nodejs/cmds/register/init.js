module.exports = function(program, run) {
    program
        .command('init')
        .description('Initialize the .prmconf file.  Downloads runtime if needed.')
        .action(run);
}