const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../helpers/errors/UnauthorizedError");

exports.isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(
      new UnauthorizedError("You are not authorized to access this route")
    );
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(
        new UnauthorizedError("You are not authorized to access this route")
      );
    }
    req.user = user;
    next();
  });
};
