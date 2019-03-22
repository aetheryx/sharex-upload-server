const mimeTypes = require('./mimeTypes.json');
const config = require('./config.json');
const crypto = require('crypto');
const http = require('http');
const path = require('path');
const { promises: fs, createReadStream, createWriteStream } = require('fs');

const server = http.createServer();

const getFilename = (extension) => {
  const filename = crypto.randomBytes(config.fileIDLength / 2).toString('hex') + extension;
  return fs.access(path.resolve(__dirname, 'files', filename))
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
          path.resolve(__dirname, 'files', filename)
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
      const filePath = path.resolve(__dirname, 'files', req.url.slice(1));

      createReadStream(filePath)
        .on('open', () => {
          res.writeHead(200, {
            'Content-Type': mimeTypes.find(([ , ext ]) => ext === path.extname(filePath))[0]
          });
        })
        .on('error', err => {
          if (err.code === 'EISDIR' || err.code === 'ENOENT') {
            res.writeHead(404, {
              'Content-Type': 'text/html'
            });
            return res.end('<h1>404 Not Found</h1>');
          } else {
            res.writeHead(500, {
              'Content-Type': 'text/html'
            });
            return res.end(`<h1>Internal Server Error</h1><br><h3>${err.message}</h3>`);
          }
        })
        .pipe(res)
        .on('end', () => {
          res.end();
        });

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