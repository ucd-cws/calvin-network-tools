exports.command = 'show [prmnames...]'
exports.describe = 'Print a list of nodes as they are represented in the pri files. Pass \'ALL\' to print everything..'
exports.builder = require('../../shared')({});

exports.handler = require('../../handler');