export default class InvalidPurchaseException extends Error {
    constructor(message = "Invalid Purchase;", ...args) {
        super(message, ...args);
        this.message = 'Invalid purchase:' + message;
      }
}
