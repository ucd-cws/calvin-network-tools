exports.command = 'debug <command>'
exports.desc = 'Debug HEC-PRM Setup'
exports.builder = function (yargs) {
  return yargs.commandDir('debug-cmds');
}
exports.handler = function (argv) {}