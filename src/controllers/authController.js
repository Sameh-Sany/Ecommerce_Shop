const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const success = require("../helpers/success.js");
const InternalError = require("../helpers/errors/InternalError.js");
const ValidationError = require("../helpers/errors/ValidationError.js");
const ResourceAlreadyExistError = require("../helpers/errors/ResourceAlreadyExistError.js");
const ResourceNotFoundError = require("../helpers/errors/ResourceNotFoundError.js");
const cart = require("../models/cart.js");
require("dotenv").config();
const sendVerificationEmail = require("../helpers/sendVerificationEmail.js");

// Register
module.exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }

    const { firstName, lastName, email, password, role } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) return next(new ResourceAlreadyExistError("User", email));

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    const token = `Bearer ${jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    })}`;

    // create cart for user after register
    await cart.create({ user: user._id });

    // send verification email with  verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    user.verificationCode = verificationCode;
    await user.save();

    await sendVerificationEmail(email, verificationCode);
    return res.json(success({ user, token }));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(err));
  }
};

// Login
module.exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(new ResourceNotFoundError("User", email));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ValidationError("Invalid credentials"));

    const token = `Bearer ${jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    })}`;

    return res.json(success({ user, token }));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(err));
  }
};

// Verify Email

module.exports.verifyEmail = async (req, res, next) => {
  try {
    // verify email with verificationCode  and update isVerified to true
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode)
      return next(new ValidationError("Invalid credentials"));

    const user = await User.findOne({ email });

    if (!user) return next(new ResourceNotFoundError("User", email));

    if (user.isVerified)
      return next(new ValidationError("Email already verified"));

    if (user.verificationCode !== verificationCode)
      return next(new ValidationError("Invalid credentials"));

    user.isVerified = true;
    await user.save();

    return res.json(success({ user }));
  } catch (err) {
    console.log(err);
    return res.status(500).json(new InternalError(err));
  }
};
