module.exports = function(program, run) {
    program
        .command('crawl')
        .description('run hobbes-network-format crawler')
        .action(run);
}