module.exports = (input) =>
  input.split('\n').reduce((agg, curr) => {
    let mass = curr;
    do {
      mass = Math.floor(mass / 3) - 2;
      agg += Math.max(0, mass);
    } while (mass > 0);
    return agg;
  }, 0);
