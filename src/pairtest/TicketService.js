import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import { MAX_TICKETS_PER_PURCHASE } from "../../config/constants.js";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    this.#checkNumberOfTicketsWithinMax(ticketTypeRequests);
    return `Yay! You have got tickets!`;
  }

  #checkNumberOfTicketsWithinMax(ticketTypeRequests) {
    const totalTickets = ticketTypeRequests.reduce((sum, request) => {
      return request.getNoOfTickets() + sum;
    }, 0);
    if (totalTickets > MAX_TICKETS_PER_PURCHASE) {
      throw new InvalidPurchaseException(`Number of tickets exceeded the maximum ${MAX_TICKETS_PER_PURCHASE}`)
    }
    return true;
  }
}
