#! /usr/bin/env node --max-old-space-size=6144

require('yargs')
  .commandDir('cmds')
  .demandCommand(1)
  .usage(require('./logo')+'\n$ cnf <command>')
  .fail(function (msg, err, yargs) {
    if (err) throw err // preserve stack
    console.error('Badness :(\n');
    console.error(msg)
    console.error('Try:\n', yargs.help())
    process.exit(1)
  })
  .help()
  .argv