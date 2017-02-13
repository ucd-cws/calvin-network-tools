exports.command = 'list <nodes...>'
exports.desc = 'Print all nodes/link. Pass \'ALL\' to print everything.'
exports.builder = require('../shared')({});

exports.handler = require('../handler');