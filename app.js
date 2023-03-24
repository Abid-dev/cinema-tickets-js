import express from "express";
import path from "path";
import ejs from "ejs";
import TicketService from "./src/pairtest/TicketService.js";
import TicketTypeRequest from "./src/pairtest/lib/TicketTypeRequest.js";
// import constants from './config/constants';TODO maybe i can use this instead of all constants separately
import {
  TICKET_TYPE_ADULT,
  TICKET_TYPE_INFANT,
  TICKET_TYPE_CHILD,
} from "./config/constants.js";

const app = express();
global.__dirname = path.resolve();
app.set("views", __dirname + "/views");
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

/** Serve static files from the public dir */
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  if (req.query.message) {
    const message = req.query.message;
    res.render("index", { message: message });
    return;
  }
  if (req.query.error) {
    const error = req.query.error;
    res.render("index", { error: error });
    return;
  }

  res.render("index");
});

app.post("/submit", (req, res) => {
  const accountId = +req.body.accountId;
  const adultTickets = +req.body.adultTickets;
  const childTickets = +req.body.childTickets;
  const infantTickets = +req.body.infantTickets;

  const ticketService = new TicketService();
  try {
    const message = ticketService.purchaseTickets(
      accountId,
      new TicketTypeRequest(TICKET_TYPE_ADULT, adultTickets),
      new TicketTypeRequest(TICKET_TYPE_CHILD, childTickets),
      new TicketTypeRequest(TICKET_TYPE_INFANT, infantTickets)
    );
    res.redirect("/?message=" + encodeURIComponent(message));
  } catch (err) {
    const error = err.message;
    res.redirect("/?error=" + encodeURIComponent(error));
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
