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
  if (req.query.message) {
    const message = req.query.message;
    res.render('index', { message: message });
    return;
  }

  res.render("index");
});

app.post('/submit', (req, res) => {
  const adultTickets = +req.body.adultTickets;
  const childTickets = +req.body.childTickets;
  const infantTickets = +req.body.infantTickets;
  let totalTickets = adultTickets + childTickets + infantTickets;
  const message = `You wanted, ${totalTickets} tickets!`;

  res.redirect('/?message=' + encodeURIComponent(message));
  // res.send(message);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
