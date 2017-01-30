/**
 * Command commands for several HEC-PRM commands
 */

module.exports = (builder) => {
  builder.prefix = {
    describe : '[prefix name] prefix name for build',
    alias : 'p'
  }
  builder.runtime = {
    describe : '[path] path to Calvin HEC Runtime',
    alias : 'r'
  }
  builder.workspace = {
    describe : '[path] directory to read/write all dss/hec-prm files',
    alias : 'w'
  }
  builder['no-initialize'] = {
    describe : 'Do not initialize the nodes/links (overrides initialize parameter)',
    alias : 'n'
  }
  builder.initialize = {
    describe : '[name] Initialize parameter for nodes/links (default: init)',
    alias : 'i'
  }
  
  return require('./shared')(builder);
}