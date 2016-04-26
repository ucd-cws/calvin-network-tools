module.exports = function(program, run) {
    var cmd = program
        .command('matrix')
        .description('Create a network matrix')
        .option('-f, --format <csv|tsv>', 'Output Format',/^(csv|tsv)$/,'tsv')
        .action(run);
}