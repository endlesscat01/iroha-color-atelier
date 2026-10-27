const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, 'dist');
const types = {
  html: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  woff2: 'font/woff2'
};

function send(res, status) {
  res.writeHead(status);
  res.end();
}

http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    return send(res, 400); // 不正なパーセントエンコード
  }
  if (pathname.includes('\0')) return send(res, 400); // NULバイト

  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) return send(res, 403);

  fs.readFile(file, (err, data) => {
    if (err) return send(res, 404);
    res.setHeader('Content-Type', types[path.extname(file).slice(1)] || 'application/octet-stream');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(data);
  });
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
