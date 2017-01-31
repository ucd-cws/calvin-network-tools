exports.command = 'apply-changes <excel-path>'
exports.desc = 'Apply http://cwn.casil.ucdavis.edu Excel file download changes to repo'
exports.builder = require('../shared')({});
exports.handler = require('../handler');