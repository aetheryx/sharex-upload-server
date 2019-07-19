const { randomBytes } = require('crypto');

const ZWS_0 = String.fromCharCode(8203);
const ZWS_1 = String.fromCharCode(6158);

module.exports = (length) =>
  [ ...randomBytes(Math.ceil(length / 8)) ]
    .map(byte => byte.toString(2).padStart(8, '0'))
    .join('')
    .slice(0, length)
    .replace(/0/g, ZWS_0)
    .replace(/1/g, ZWS_1);
