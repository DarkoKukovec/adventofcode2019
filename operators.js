const { of } = require('rxjs');
const { map, reduce, switchMap } = require('rxjs/operators');

module.exports = {
  parse: (separator = '\n', parseNumber = true) =>
    switchMap((data) =>
      of(...data.split(separator)).pipe(
        map((x) => (parseNumber ? parseInt(x, 10) : x)),
      ),
    ),
  sum: () => reduce((agg, curr) => agg + curr),
};
