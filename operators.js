const { of } = require('rxjs');
const { reduce, switchMap } = require('rxjs/operators');

module.exports = {
  parse() {
    return switchMap((data) => of(...data.split('\n')));
  },
  sum() {
    return reduce((agg, curr) => agg + curr);
  },
};
