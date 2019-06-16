const handleGet = require('./handlers/get.js');
const handlePost = require('./handlers/post.js');
const handleError = require('./handlers/error.js');
const files = require('./util/files.js');
const config = require('../config.json');
const { createServer } = require('http');

const server = createServer();

server.on('request', (req, res) => {
  switch (req.method) {
    case 'POST':
      handlePost(req, res, files).catch(handleError.bind(null, req, res));
      break;

    case 'GET':
      handleGet(req, res, files).catch(handleError.bind(null, req, res));
      break;

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
