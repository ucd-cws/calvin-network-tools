exports.command = 'init'
exports.desc = 'Initialize the .prmconf file.  Downloads runtime if needed.'
exports.builder = {};

exports.handler = require('../../handler');