// server.js
import http from 'http';
import url from 'url';
import querystring from 'querystring';
import path from 'path';
import fs from 'fs';

global.__dirname = path.resolve();
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif'
  };
const server = http.createServer((req, res) => {

    const filePath = req.url === '/' ? './index.html' : `.${req.url}`;
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404 Not Found');
    } else {
      res.writeHead(200, {'Content-Type': contentType});
      res.end(data);
    }
  });


//   if (req.method === 'POST' && req.url === '/submit') {
//     let body = '';

//     req.on('data', (chunk) => {
//       body += chunk.toString();
//     });

//     req.on('end', () => {
//       const formData = querystring.parse(body);
//       const adultTickets = formData.adultTickets;

//       // Do something with the form data
//       console.log(`adultTickets: ${adultTickets}`);

//       // Send a response back to the client
//       res.writeHead(200, { 'Content-Type': 'text/plain' });
//       res.end('Form submitted successfully');
//     });
//   } else {
//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     res.end('Page not found');
//   }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});

process.on('SIGINT', () => {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
