const { range } = require('rxjs');
const { filter, reduce, switchMap } = require('rxjs/operators');

module.exports = [
  switchMap((input) =>
    range(
      ...input
        .split('-')
        .map((val) => parseInt(val, 10))
        .map((curr, index, arr) => (index ? curr - arr[0] : curr)),
    ),
  ),
  filter(
    (val) =>
      val
        .toString()
        .split('')
        .sort()
        .join('') === val.toString(),
  ),
  filter((val) =>
    val
      .toString()
      .split('')
      .reduce(
        (agg, curr, index, arr) =>
          agg ||
          (curr === arr[index + 1] &&
            curr !== arr[index + 2] &&
            curr !== arr[index - 1]),
        false,
      ),
  ),
  reduce((agg) => agg + 1, 0),
];
