const { of } = require('rxjs');
const { map, reduce, switchMap } = require('rxjs/operators');

function getValue(program, mode, value, relativeBase) {
  if (mode === '2') {
    return program[relativeBase + value] || 0;
  }
  return mode === '1' ? value : program[value] || 0;
}

function setValue(program, mode, value, data, relativeBase, output) {
  if (mode === '2') {
    program[relativeBase + value] = data;
  } else if (mode === '1') {
    output.push(data);
  } else {
    program[value] = data;
  }
}

function interpreter(params) {
  return ({
    program: prog,
    input: inp,
    position: pos,
    relativeBase: relative,
  }) => {
    let position = pos || 0;
    let program = prog.slice();
    let input = (inp || []).slice();
    let relativeBase = relative || 0;
    const output = [];

    while (program[position] !== 99) {
      const [cmdCode, a, b, x] = program.slice(position, position + 4);
      const [c2 = 0, c1 = 0, mA = 0, mB = 0, mC = 0] = cmdCode
        .toString()
        .split('')
        .reverse();
      const cmd = parseInt(`${c1}${c2}`, 10);
      const aVal = getValue(program, mA, a, relativeBase);
      const bVal = getValue(program, mB, b, relativeBase);

      if (cmd === 1) {
        setValue(program, mC, x, aVal + bVal, relativeBase, output);
        position += 4;
      } else if (cmd === 2) {
        setValue(program, mC, x, aVal * bVal, relativeBase, output);
        position += 4;
      } else if (cmd === 3) {
        if (!input.length) {
          return {
            type: 'pause',
            output,
            program,
            position,
            relativeBase,
          };
        }
        setValue(program, mA, a, input.shift(), relativeBase, output);
        position += 2;
      } else if (cmd === 4) {
        output.push(aVal);
        position += 2;
      } else if (cmd === 5) {
        position = aVal ? bVal : position + 3;
      } else if (cmd === 6) {
        position = aVal ? position + 3 : bVal;
      } else if (cmd === 7) {
        setValue(program, mC, x, aVal < bVal ? 1 : 0, relativeBase, output);
        position += 4;
      } else if (cmd === 8) {
        setValue(program, mC, x, aVal === bVal ? 1 : 0, relativeBase, output);
        position += 4;
      } else if (cmd === 9) {
        relativeBase += aVal;
        position += 2;
      }
    }

    return {
      type: 'end',
      output,
      params,
      program,
    };
  };
}

module.exports = {
  parse: (separator = '\n', parseNumber = true) =>
    switchMap((data) =>
      of(...data.split(separator)).pipe(
        map((x) => (parseNumber ? parseInt(x, 10) : x)),
      ),
    ),
  sum: () => reduce((agg, curr) => agg + curr),
  programWithVerbs: () =>
    switchMap(({ params, ...opts }) =>
      of({
        ...opts,
        program: [
          opts.program[0],
          ...params,
          ...opts.program.slice(params.length + 1),
        ],
      }).pipe(map(interpreter(params))),
    ),
  program: (params) => map(interpreter(params)),
  programOutput: () => map(({ output }) => output.pop()),
  interpreter,
};
