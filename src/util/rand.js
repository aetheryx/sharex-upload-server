const { randomBytes } = require('crypto');

const b62 = (() => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return [
    ...alphabet,
    ...alphabet.toUpperCase(),
    ...Array(10).fill(0).map((_, i) => i)
  ];
})();

module.exports = (size) =>
  [ ...randomBytes(size) ]
    .map(byte => b62[+byte % 62])
    .join('');
