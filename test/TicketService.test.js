import TicketService from "../src/pairtest/TicketService.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import {
  MAX_TICKETS_PER_PURCHASE,
  TICKET_PRICE_ADULT,
  TICKET_PRICE_CHILD,
  TICKET_TYPE_ADULT,
  TICKET_TYPE_CHILD,
  TICKET_TYPE_INFANT,
} from "../config/constants.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";

test("No account ID to throw exception", () => {
  const service = () => new TicketService().purchaseTickets();
  expect(service).toThrow(InvalidPurchaseException);
});

test("Invalid account id type should throw error", () => {
  const purchaseTickets = () => {
    new TicketService().purchaseTickets("accountID");
  };
  expect(purchaseTickets).toThrow(InvalidPurchaseException);
});

test("valid account id shouldnt throw an accound id error but an error for not having an adult ticket", () => {
  const purchaseTickets = () => {
    new TicketService().purchaseTickets(1);
  };
  expect(purchaseTickets).toThrow(
    new InvalidPurchaseException(
      "There must be at least one adult to accompany the children"
    )
  );
});

test("With a single adult ticket, there should be a success result", () => {
  const purchaseTickets = () => {
    return new TicketService().purchaseTickets(
      1,
      new TicketTypeRequest(TICKET_TYPE_ADULT, 1)
    );
  };
  expect(purchaseTickets).not.toThrow(InvalidPurchaseException);
});

test("More than max tickets shoudld throw an exception", () => {
  const purchaseTickets = () => {
    return new TicketService().purchaseTickets(
      1,
      new TicketTypeRequest(TICKET_TYPE_ADULT, 21)
    );
  };
  expect(purchaseTickets).toThrow(InvalidPurchaseException);
});

test("More than max tickets shoudld throw an exception", () => {
  const purchaseTickets = () => {
    return new TicketService().purchaseTickets(
      1,
      new TicketTypeRequest(TICKET_TYPE_ADULT, 11), new TicketTypeRequest(TICKET_TYPE_CHILD, 11)
    );
  };
  expect(purchaseTickets).toThrow(InvalidPurchaseException);
});

test("Check if totals calcs is done and no errors are thrown", () => {
    const purchaseTickets = () => {
      return new TicketService().purchaseTickets(
        1,
        new TicketTypeRequest(TICKET_TYPE_ADULT, 2), new TicketTypeRequest(TICKET_TYPE_CHILD, 3)
      );
    };
    expect(purchaseTickets).not.toThrow(InvalidPurchaseException);
  });

  test("Check if total seats are allocated and no errors are thrown", () => {
    const purchaseTickets = () => {
      return new TicketService().purchaseTickets(
        1,
        new TicketTypeRequest(TICKET_TYPE_ADULT, 2), new TicketTypeRequest(TICKET_TYPE_CHILD, 3), new TicketTypeRequest(TICKET_TYPE_CHILD, 2)
      );
    };
    expect(purchaseTickets).not.toThrow(InvalidPurchaseException);
  });



