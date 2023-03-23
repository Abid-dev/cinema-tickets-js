import express from 'express';
import path from 'path';
import ejs from 'ejs';

const app = express();
global.__dirname = path.resolve();
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

/** Serve static files from the public dir */
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render("index");
});

app.post('/submit', (req, res) => {
  const adultTickets = req.body.adultTickets;
  console.log(adultTickets);
  const message = `Hello, ${adultTickets}!`;

  res.send(message);

});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
