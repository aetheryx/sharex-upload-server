const mimeTypes = require('../util/mimeTypes.json');
const { createReadStream } = require('fs');

module.exports = async (req, res, files) => {
  const requestPath = decodeURIComponent(req.url) === req.url
    ? req.url.slice(1)
    : decodeURIComponent(req.url.slice(1));

  if (requestPath.includes('..') || requestPath.includes('/')) {
    res.writeHead(400, {
      'Content-Type': 'text/html'
    });
    return res.end('<h1>400 Bad Request</h1><br><h3>Request path may not include <code>..</code> or <code>/</code></h3>')
  }

  const file = files.get(requestPath);
  if (!file) {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    });
    return res.end('<h1>404 Not Found</h1>');
  }

  const contentType = mimeTypes.find(([ , ext ]) => ext === file.ext);
  createReadStream(file.path)
    .on('open', () => {
      if (contentType) {
        res.setHeader('Content-Type', contentType[0]);
      }
    })
    .pipe(res);
};
