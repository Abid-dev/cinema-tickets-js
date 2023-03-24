import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import {
  MAX_TICKETS_PER_PURCHASE,
  TICKET_PRICE_ADULT,
  TICKET_PRICE_CHILD,
  TICKET_TYPE_ADULT,
  TICKET_TYPE_CHILD,
  TICKET_TYPE_INFANT,
} from "../../config/constants.js";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    this.#checkAccountId(accountId);
    const totalTickets =
      this.#checkNumberOfTicketsWithinMax(ticketTypeRequests);
    this.#checkForAdultTickets(ticketTypeRequests);

    const totalCost = this.#getTotalCost(ticketTypeRequests);
    new TicketPaymentService().makePayment(accountId, totalCost);

    const totalSeats = this.#getTotalSeats(ticketTypeRequests);
    new SeatReservationService().reserveSeat(accountId, totalSeats);

    return `Your payment of £${totalCost} was successfully. You have got ${totalTickets} tickets with ${totalSeats} seats booked!`;
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
    return totalTickets;
  }

  #checkForAdultTickets(ticketTypeRequests) {
    const adultTickets = ticketTypeRequests.reduce((sum, type) => {
      if (type.getTicketType() === TICKET_TYPE_ADULT) {
        return type.getNoOfTickets() + sum;
      }
      return sum;
    }, 0);

    if (adultTickets < 1) {
      throw new InvalidPurchaseException(
        "There must be at least one adult to accompany the children"
      );
    }
    return true;
  }

  #getTotalSeats(ticketTypeRequests) {
    return ticketTypeRequests.reduce((sum, type) => {
      if (type.getTicketType() !== TICKET_TYPE_INFANT) {
        return sum + type.getNoOfTickets();
      }
      return sum;
    }, 0);
  }

  #getTotalCost(ticketTypeRequests) {
    return ticketTypeRequests.reduce((sum, type) => {
      if (type.getTicketType() === TICKET_TYPE_ADULT) {
        return sum + TICKET_PRICE_ADULT * type.getNoOfTickets();
      } else if (type.getTicketType() === TICKET_TYPE_CHILD) {
        return sum + TICKET_PRICE_CHILD * type.getNoOfTickets();
      }
      return sum;
    }, 0);
  }
}
