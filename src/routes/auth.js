const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  register,
  login,
  verifyEmail,
} = require("../controllers/authController");

router.post(
  "/register",
  [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email")
      .isEmail()
      .withMessage("Email is invalid")
      .notEmpty()
      .withMessage("Email is required"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be more than 6 Characters"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").not().isEmpty().withMessage("email is Required"),
    body("password").not().isEmpty().withMessage("password is Required"),
  ],
  login
);

router.post("/verify-email", verifyEmail);

module.exports = router;
