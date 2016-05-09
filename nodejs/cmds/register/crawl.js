module.exports = function(program, run) {
    program
        .command('crawl')
        .allowUnknownOption()
        .description('run hobbes-network-format crawler')
        .action(run);
}