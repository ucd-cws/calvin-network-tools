module.exports = function(program, run) {
    var cmd = program
        .command('excel')
        .description('apply calvin-network-app excel download changes to repo')
        .option('-x, --excel-path [path]', 'path to excel file to use')
        .action(run);
}