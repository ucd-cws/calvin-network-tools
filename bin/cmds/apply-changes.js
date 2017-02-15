exports.command = 'apply-changes <command>'
exports.desc = 'Commands related to updating the calvin-network-data repository'
exports.builder = function (yargs) {
  return yargs.commandDir('apply-changes-cmds');
}
exports.handler = function (argv) {}