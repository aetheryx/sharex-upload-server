module.exports = (_, res, error) => {
  res.writeHead(500, {
    'Content-Type': 'text/html'
  });
  res.end(`<h1>500 Internal Server Error</h1><br><h3>${error.message}</h3>`);
};