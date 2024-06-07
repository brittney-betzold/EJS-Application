const express = require("express");
const passport = require("passport");
const csrf = require("csurf");
const csrfProtection = require("../middleware/csrfProtection");

const router = express.Router();

const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} = require("../controllers/sessionController");

router
  .route("/register")
  .get(csrfProtection, registerShow)
  .post(csrfProtection, registerDo);
router
  .route("/logon")
  .get(csrfProtection, logonShow)
  .post(
    csrfProtection,
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    })
  );
router.route("/logoff").post(logoff); // No CSRF protection here

module.exports = router;
