/**
 * Shared options for the build/run/update commands
 */

module.exports = function(cmd) {
    cmd
        .option('-c, --config [path]', 'Path to .prmconf file.  Defaults to home dir.')
        .option('-p, --prefix [prefix name]', 'prefix name for build')
        .option('-d, --data [repo/path/data]', 'path to Calvin Network /data folder')
        .option('-r, --runtime [path]', 'path to Calvin HEC Runtime')
        .option('-w, --workspace [path]', 'directory to read/write all dss/hec-prm files')
        .option('-n, --no-initialize', 'Do not initialize the nodes/links (overrides initialize parameter)')
        .option('-i, --initialize', 'Initialize parameter for nodes/links (default: init)');
}