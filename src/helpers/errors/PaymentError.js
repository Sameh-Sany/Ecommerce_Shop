const BaseError = require("./BaseError");

class PaymentError extends BaseError {

  constructor(error) {
    console.log(error),
    super(error.statusText);
    this.statusCode = error.status;
    this.errors = [
      { "msg": error.data }
    ];
  }
}
module.exports = PaymentError;
