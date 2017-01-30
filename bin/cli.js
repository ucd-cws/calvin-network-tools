#! /usr/bin/env node --max-old-space-size=4096

require('yargs')
  .commandDir('cmds')
  .demandCommand(1)
  .usage(require('./logo')+'\n$ cnf <command>')
  .fail(function (msg, err, yargs) {
    if (err) throw err // preserve stack
    console.error('You broke it!')
    console.error(msg)
    console.error('You should be doing', yargs.help())
    process.exit(1)
  })
  .help()
  .argv