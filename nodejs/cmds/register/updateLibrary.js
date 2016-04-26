module.exports = function(program, run) {
    var cmd = program
        .command('update-library')
        .description('Update the Calvin HEC Runtime')
        .action(run);
}