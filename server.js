'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const SITE_DIR = path.join(__dirname, 'site');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.resolve(SITE_DIR, '.' + urlPath);

  if (!filePath.startsWith(SITE_DIR + path.sep) && filePath !== SITE_DIR) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<!DOCTYPE html><html><body><h1>404 - Page Not Found</h1></body></html>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n========================================');
  console.log('   Playwright Practice Site');
  console.log('========================================');
  console.log(`\n   URL: http://localhost:${PORT}`);
  console.log('\n   Login Credentials:');
  console.log('     admin / admin123');
  console.log('     testuser / password');
  console.log('\n   Press Ctrl+C to stop\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is in use. Try: lsof -ti:${PORT} | xargs kill`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
