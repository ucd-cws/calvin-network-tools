exports.command = 'init'
exports.describe = 'Initialize the .prmconf file.  Downloads HEC-PRM runtime if needed.'
exports.builder = require('../../shared')({});

exports.handler = require('../../handler');