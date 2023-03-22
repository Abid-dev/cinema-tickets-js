import express from 'express';
import path from 'path';
import mime from 'mime';

const app = express();
global.__dirname = path.resolve();

/** Serve static files from the public dir */
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const htmlPath = path.join(new URL('./index.html', import.meta.url).pathname);
    res.sendFile(htmlPath);});

app.post('/submit', (req, res) => {
  const adultTickets = req.body.adultTickets;
  console.log(adultTickets);
  const message = `Hello, ${adultTickets}!`;

  res.send(message);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
