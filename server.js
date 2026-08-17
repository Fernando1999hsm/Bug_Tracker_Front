const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const SUPABASE_URL = process.env.SUPABASE_URL || 'PENDING';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'PENDING';

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url);
  const pathname = decodeURIComponent(parsed.pathname);

  if (pathname === '/env.js') {
    const payload = JSON.stringify({ SUPABASE_URL, SUPABASE_ANON_KEY });
    res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
    res.end('window.__SUPABASE_ENV__ = ' + payload + ';');
    return;
  }

  let filePath = path.join(__dirname, pathname);
  if (pathname === '/' || pathname.endsWith('/')) {
    filePath = path.join(filePath, 'index.html');
  } else if (!path.extname(filePath)) {
    filePath += '.html';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('Bug Tracker running at http://localhost:' + PORT);
});