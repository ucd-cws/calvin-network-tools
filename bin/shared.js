/**
 * Shared options form many commands
 */

function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = (builder) => {
  builder.config = {
    describe : '[path] Path to .prmconf file.',
    default : getUserHome(),
    alias : 'c'
  }
  builder.data = {
    describe : '[repo/path/data] path to Calvin Network /data folder.',
    alias : 'd'
  }
  builder.verbose = {
    describe : 'Verbose output, including hec-dss library output for hec-prm cmds.',
    alias : 'v',
    type : 'boolean'
  }
  return builder;
}