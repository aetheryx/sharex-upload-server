const { randomBytes } = require('crypto');
const zeroWidthChars = [
  '\u200B',
  '\u200C',
  '\u200D',
  '\u2060',
  '\uFEFF',
  '\u180E'
];

module.exports = (size) =>
  [ ...randomBytes(size) ]
    .map(byte => zeroWidthChars[+byte % zeroWidthChars.length])
    .join('');
