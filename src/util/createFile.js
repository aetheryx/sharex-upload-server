const path = require('path');
const files = require('./files.js');
const config = require('../../config.json');

const idGenerator = require(`../formats/${config.format}`);

function createFile (ext) {
  const id = idGenerator(config.fileIDLength);
  if (files.has(id)) {
    return createFile(ext);
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