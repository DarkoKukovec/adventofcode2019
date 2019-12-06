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
    while (queue.length) {
      const current = queue.shift();
      queue.push(...current.orbitedBy);
      current.depth = current.orbits.depth + 1;
    }
    return list;
  }),
  map((list) => {
    const you = list.YOU;
    const youMap = [];
    let currentYou = you;
    while (currentYou.orbits) {
      currentYou = currentYou.orbits;
      youMap.push(currentYou);
    }

    const santa = list.SAN;
    const santaMap = [];
    let currentSanta = santa;
    while (currentSanta.orbits) {
      currentSanta = currentSanta.orbits;
      santaMap.push(currentSanta);
    }

    const reverseantaMap = santaMap.reverse();
    return youMap.reverse().reduce((dist, curr, index, arr) => {
      if (dist) {
        return dist;
      }
      if (curr !== reverseantaMap[index]) {
        return arr.length + santaMap.length - 2 * index;
      }
      return dist;
    }, 0);
  }),
];
