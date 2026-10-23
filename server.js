const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let cleanUrl = req.url.split('?')[0];
  let filePath = path.join(__dirname, cleanUrl === '/' ? 'index.html' : cleanUrl);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (cleanUrl.startsWith('/public/')) {
        let altPath = path.join(__dirname, cleanUrl.replace('/public/', ''));
        fs.readFile(altPath, (errAlt, dataAlt) => {
          if (!errAlt) {
            sendResponse(res, altPath, dataAlt);
            return;
          }
          send404(res);
        });
        return;
      }
      send404(res);
    } else {
      sendResponse(res, filePath, data);
    }
  });
});

function sendResponse(res, filePath, data) {
  let ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
  res.end(data);
}

function send404(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`KL Edits Web Server running at http://localhost:${PORT}`);
});
