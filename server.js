const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT) || 3000;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8'
};

const sendFile = (res, filePath) => {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
};

const server = http.createServer((req, res) => {
  const requestPath = (req.url || '/').split('?')[0];
  const safePath = path.normalize(requestPath).replace(/^\/+/, '');
  const resolvedPath = safePath ? path.join(root, safePath) : path.join(root, 'index.html');

  if (!resolvedPath.startsWith(root)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  const finalPath = path.extname(resolvedPath) ? resolvedPath : path.join(resolvedPath, 'index.html');

  fs.stat(finalPath, (error, stats) => {
    if (error || !stats.isFile()) {
      sendFile(res, path.join(root, 'index.html'));
      return;
    }

    sendFile(res, finalPath);
  });
});

server.listen(port, () => {
  console.log(`Anmol portfolio running at http://localhost:${port}`);
});
