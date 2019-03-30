const mimeTypes = require('./mimeTypes.json');
const config = require('../config.json');
const crypto = require('crypto');
const http = require('http');
const path = require('path');
const { promises: fs, createReadStream, createWriteStream } = require('fs');

const server = http.createServer();
const filesDirectory = path.resolve(__dirname, '..', 'files');

const getFilename = (extension) => {
  const filename = crypto.randomBytes(config.fileIDLength / 2).toString('hex') + extension;
  return fs.access(path.resolve(filesDirectory, filename))
    .then(() => getFilename(extension))
    .catch(() => filename);
};

server.on('request', async (req, res) => {
  switch (req.method) {
    case 'POST': {
      if (req.headers['authorization'] !== config.key) {
        res.writeHead(401, {
          'Content-Type': 'application/json'
        });
        return res.end(JSON.stringify({
          message: 'Authorization header incorrect'
        }));
      }

      const filename = await getFilename(
        mimeTypes.find(([ type ]) => type === req.headers['content-type'])[1]
      );

      req.pipe(
        createWriteStream(
          path.resolve(filesDirectory, filename)
        )
      );

      req.on('end', () => {
        res.writeHead(200, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
          filename
        }));
      });

      break;
    }

    case 'GET': {
      const requestPath = req.url.slice(1);
      if (requestPath.includes('..')) {
        res.writeHead(400, {
          'Content-Type': 'text/html'
        });
        return res.end('<h1>400 Bad Request</h1><br><h3>Request path may not include <code>..</code></h3>')
      }

      const filePath = path.resolve(filesDirectory, requestPath);
      const contentType = mimeTypes.find(([ , ext ]) => ext === path.extname(filePath));

      createReadStream(filePath)
        .on('open', () => {
          if (contentType) {
            res.setHeader('Content-Type', contentType[0]);
          }
        })
        .on('error', (err) => {
          if (err.code === 'EISDIR' || err.code === 'ENOENT') {
            res.writeHead(404, {
              'Content-Type': 'text/html'
            });
            res.end('<h1>404 Not Found</h1>');
          } else {
            res.writeHead(500, {
              'Content-Type': 'text/html'
            });
            res.end(`<h1>Internal Server Error</h1><br><h3>${err.message}</h3>`);
          }
        })
        .pipe(res);

      break;
    }

    default:
      res.writeHead(405, {
        Allow: 'GET, POST'
      });
      res.end('<h1>405 Method Not Allowed</h1>');
  }
});

server.listen(config.port, () =>
  console.log('Listening to port', config.port)
);