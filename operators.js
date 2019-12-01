const { of } = require('rxjs');
const { map, reduce, switchMap } = require('rxjs/operators');

module.exports = {
  parse: (separator = '\n', parse) =>
    switchMap((data) =>
      of(...data.split(separator)).pipe(
        map((x) => (parse ? parseInt(x, 10) : x)),
      ),
    ),
  sum: () => reduce((agg, curr) => agg + curr),
};
