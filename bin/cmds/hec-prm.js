exports.command = 'hec-prm <command>'
exports.desc = 'Run HEC-PRM related command'
exports.builder = function (yargs) {
  return yargs.commandDir('hec-prm-cmds');
}
exports.handler = function (argv) {}