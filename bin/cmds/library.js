exports.command = 'library <command>'
exports.desc = 'Run cnf maintenance related command'
exports.builder = function (yargs) {
  return yargs.commandDir('library-cmds');
}
exports.handler = function (argv) {}