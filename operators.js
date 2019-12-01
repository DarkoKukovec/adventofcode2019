const { of } = require('rxjs');
const { reduce, switchMap } = require('rxjs/operators');

module.exports = {
  parse(separator = '\n', parse) {
    return switchMap((data) => {
      const val = data.split(separator);
      return parse ? of(...val.map((x) => parseInt(x, 10))) : of(...val);
    });
  },
  sum() {
    return reduce((agg, curr) => agg + curr);
  },
};
