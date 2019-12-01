const { parse, sum, mapItems } = require('../../utils');

module.exports = [parse(), mapItems((val) => Math.floor(val / 3) - 2), sum()];
