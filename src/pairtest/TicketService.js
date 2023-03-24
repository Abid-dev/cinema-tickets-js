import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import {
  MAX_TICKETS_PER_PURCHASE,
  TICKET_TYPE_ADULT,
} from "../../config/constants.js";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    this.#checkAccountId(accountId);
    this.#checkNumberOfTicketsWithinMax(ticketTypeRequests);
    this.#checkForAdultTickets(ticketTypeRequests);
    return `Yay! You have got tickets!`;
  }

  #checkAccountId(accountId) {
    if (!accountId) {
      throw new InvalidPurchaseException("An Account ID is required");
    }

    if (accountId <= 0) {
      throw new InvalidPurchaseException(
        "Account ID must be greater than zero"
      );
    }

    return true;
  }

  #checkNumberOfTicketsWithinMax(ticketTypeRequests) {
    const totalTickets = ticketTypeRequests.reduce((sum, request) => {
      return request.getNoOfTickets() + sum;
    }, 0);
    if (totalTickets > MAX_TICKETS_PER_PURCHASE) {
      throw new InvalidPurchaseException(
        `Number of tickets exceeded the maximum ${MAX_TICKETS_PER_PURCHASE}`
      );
    }
    return true;
  }

  #checkForAdultTickets(ticketTypeRequests) {
    const adultTickets = ticketTypeRequests.reduce((sum, type) => {
      if (type.getTicketType() === TICKET_TYPE_ADULT) {
        return type.getNoOfTickets() + sum;
      }
      return sum;
    }, 0);

    if (adultTickets < 1) {
      throw new InvalidPurchaseException("There must be at least one adult to accompany the children")
    }
    return true;
  }
}
