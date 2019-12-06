const { map, reduce } = require('rxjs/operators');
const { parse } = require('../../operators');

module.exports = [
  parse('\n', false),
  reduce((acc, curr) => {
    const [a, b] = curr.split(')');
    const aObj = (acc[a] = acc[a] || { name: a, orbits: null, orbitedBy: [] });
    const bObj = (acc[b] = acc[b] || { name: b, orbits: null, orbitedBy: [] });

    aObj.orbitedBy.push(bObj);
    bObj.orbits = aObj;

    return acc;
  }, {}),
  map((list) => {
    const center = Object.values(list).find((item) => item.orbits === null);
    center.depth = 0;
    const queue = center.orbitedBy;
    let sum = 0;
    while (queue.length) {
      const current = queue.shift();
      queue.push(...current.orbitedBy);
      current.depth = current.orbits.depth + 1;
      sum += current.depth;
    }
    return sum;
  }),
];
