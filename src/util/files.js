const fs = require('fs');
const path = require('path');

const files = new Map();
const filesDir = path.resolve(__dirname, '..', '..', 'files');
for (const file of fs.readdirSync(filesDir)) {
  if (file.startsWith('.')) {
    files.set(file, {
      filename: file,
      ext: '',
      path: path.join(filesDir, file)
    });
    continue;
  }

  const [ filename, ...extensions ] = file.split('.');
  files.set(filename, {
    filename,
    ext: `.${extensions.join('.')}`,
    path: path.join(filesDir, file)
  });
}

module.exports = files;