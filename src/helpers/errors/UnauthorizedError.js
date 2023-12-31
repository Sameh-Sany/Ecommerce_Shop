const BaseError = require("./BaseError");

class UnauthorizedError extends BaseError {
  constructor(error = "Unauthorized") {
    super(error);
    this.statusCode = 401;
    this.errors = [
      {
        msg: error,
      },
    ];
  }
}

module.exports = UnauthorizedError;
