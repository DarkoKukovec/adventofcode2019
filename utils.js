const { map } = require('rxjs/operators');

module.exports = {
  sum() {
    return map((data) => data.reduce((agg, curr) => agg + curr));
  },
  mapItems(fn) {
    return map((data) => data.map(fn));
  },
  parse() {
    return map((data) => data.split('\n'));
  },
};
