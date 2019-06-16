const path = require('path');
const files = require('./files.js');
const rand = require('./rand.js');
const config = require('../../config.json');

function createFile (ext) {
  const id = rand(config.fileIDLength);
  if (files.has(id)) {
    return getFilename(ext);
  }

  const data = {
    filename: id,
    ext,
    path: path.resolve(__dirname, '..', '..', 'files', id + ext)
  };
  files.set(id, data);

  return data;
}

module.exports = createFile;