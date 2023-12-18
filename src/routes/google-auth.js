const express = require("express");
const router = express.Router();
require("dotenv").config();
const passport = require("passport");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.redirect("http://google.com");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    res.redirect("http://localhost:3000/");
  });
});

router.get("/current_user", (req, res) => {
  res.send(req.user);
});

module.exports = router;
