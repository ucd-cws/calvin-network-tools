exports.command = 'run'
exports.describe = 'Run the hecprm.exe program with provided prefix files. Wine is required (non-windoz).'
exports.builder = require('../../hec-prm-shared')({});

exports.handler = require('../../handler');