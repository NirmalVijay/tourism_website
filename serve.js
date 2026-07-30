const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 8000;
const root = process.cwd();
const mime = {
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webmanifest: 'application/manifest+json',
  ico: 'image/x-icon',
};

http.createServer((req, res) => {
  const requestPath = req.url.split('?')[0];
  const requested = requestPath === '/' ? 'index.html' : decodeURIComponent(requestPath.replace(/^\/+/, ''));
  const filePath = path.join(root, requested);

  if (!filePath.startsWith(root)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Server error');
      }

      const ext = path.extname(filePath).slice(1);
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
}).listen(port, () => {
  console.log('Serving http://localhost:' + port);
  console.log('Root:', root);
});
